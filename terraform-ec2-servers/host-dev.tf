module "landscapp-stage" {
  source = "./tf-modules"

  instance-type = "t2.micro"
  instance-tag = "Project-Name Dev"
  ssl-cert-dir = "host"
  nginx-conf-file = "nginx.dev.conf"
  elastic-ip-id = "eipalloc-f71a63cd"
}
