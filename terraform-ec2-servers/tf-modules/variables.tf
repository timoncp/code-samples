# Jenkins AWS credentials - used by jenkins inside the docker image
variable "aws_jenkins_access_key" {}
variable "aws_jenkins_secret_key" {}
variable "aws_jenkins_region" {
  default = "eu-west-1"
}

# Terraform AWS credentials - used by TF to communicate to AWS in order to manage the needed resources
variable "aws_terraform_access_key" {}
variable "aws_terraform_secret_key" {}
variable "aws_terraform_region" {
  default = "eu-west-1"
}
variable "aws_ssh_key" {
  default = "./keys/aws/aws.pem"
}

# general variables
variable "aws_credentials_file_path" {
  default = "/home/ec2-user/.aws/credentials"
}
variable "terraform_path" {
  default = "/home/ec2-user/terraform"
}
