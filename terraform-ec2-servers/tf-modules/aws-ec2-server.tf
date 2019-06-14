variable "instance-type" {}
variable "instance-tag" {}
variable "ssl-cert-dir" {}
variable "nginx-conf-file" {}
variable "elastic-ip-id" {}

provider "aws" {
  access_key = "${var.aws_terraform_access_key}"
  secret_key = "${var.aws_terraform_secret_key}"
  region     = "${var.aws_terraform_region}"
}

resource "aws_instance" "server" {
  ami               = "ami-7d50491b"
  availability_zone = "eu-west-1b"
  instance_type     = "${var.instance-type}"
  security_groups   = ["ssh", "http", "https", "db"]
  key_name          = "AWS"
  user_data         = "${file("ec2-user-data.sh")}"

  root_block_device {
    volume_size = "8"
    volume_type = "gp2"
  }

  # separate volume for DataBase
  ebs_block_device {
    device_name = "/dev/sdf"
    volume_size = 16
    volume_type = "gp2"
  }

  tags {
    Name = "${var.instance-tag}"
  }

  connection {
    user        = "ec2-user"
    private_key = "${file(var.aws_ssh_key)}"
  }

  # Copy required files - but fist create the folder where to copy the files
  provisioner "remote-exec" {
    inline = [
      "mkdir terraform",
    ]
  }
  provisioner "file" {
    source      = "./nginx/${var.nginx-conf-file}"
    destination = "${var.terraform_path}/nginx.conf"
  }
  provisioner "file" {
    source      = "./keys/${var.ssl-cert-dir}"
    destination = "${var.terraform_path}"
  }

  provisioner "remote-exec" {
    inline = [
      # add ec2-user to root group
      "sudo usermod -a -G root ec2-user",
      # create the folders needed for mongodb container in order to handle permissions here
      "sudo mkdir /db-drive/db /db-drive/backup /db-drive/restore",
      # add write permissions for all 'root' group users so that ec2-user can also work on this directory
      "sudo chmod -R g+rwx /db-drive",
      # install and start docker
      "sudo yum -y install docker",
      "sudo service docker start",
      "sudo usermod -a -G docker ec2-user",
      # create the docker network
      "sudo docker network create --subnet=172.18.0.0/16 mynet",
      # install nginx and add proper conf and cert
      "sudo yum -y install nginx",
      "sudo mkdir -p /etc/pki/nginx/private",
      "sudo cp ${var.terraform_path}/${var.ssl-cert-dir}/cert /etc/pki/nginx/server.crt",
      "sudo cp ${var.terraform_path}/${var.ssl-cert-dir}/pk //etc/pki/nginx/private/server.key",
      "sudo cp ${var.terraform_path}/nginx.conf /etc/nginx/nginx.conf",
      "sudo service nginx start",
      # install java 8 and remove old version
      "sudo yum -y install java-1.8.0",
      "sudo yum -y remove java-1.7.0-openjdk",
      # update awscli
      "pip install --upgrade --user awscli",
      # configure AWS cli
      "mkdir /home/ec2-user/.aws",
      "echo '[default]' >> ${var.aws_credentials_file_path}",
      "echo 'aws_access_key_id=${var.aws_terraform_access_key}' >> ${var.aws_credentials_file_path}",
      "echo 'aws_secret_access_key=${var.aws_terraform_secret_key}' >> ${var.aws_credentials_file_path}",
      "echo 'region=${var.aws_terraform_region}' >> ${var.aws_credentials_file_path}",
      "echo 'output=json' >> ${var.aws_credentials_file_path}",
    ]
  }
}


# assign the Elastic IP
resource "aws_eip_association" "landscapp-eip" {
  instance_id   = "${aws_instance.landscapp-server.id}"
  allocation_id = "${var.elastic-ip-id}"
}
