module "landscapp-release" {
  source = "./tf-modules"

  instance-type   = "t2.micro"
  instance-tag    = "Project-Name Stage"
  ssl-cert-dir    = "host"
  nginx-conf-file = "nginx.stage.conf"
  elastic-ip-id   = "eipalloc-eaa506d7"
}
