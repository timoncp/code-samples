provider "aws" {
  access_key = ""
  secret_key = ""
  region     = "eu-west-1"
}

resource "aws_instance" "microtest" {
  ami               = "ami-7d50491b"
  availability_zone = "eu-west-1b"
  instance_type     = "t2.micro"
  security_groups   = ["ssh"]
  key_name          = "AWS EC2 Test"
  instance-tag = "Micro Test"
}
