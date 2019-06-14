module "landscapp-prod" {
  source = "./tf-modules"

  instance-type = "t2.medium"
  instance-tag = "Project-Name Prod"
  ssl-cert-dir = "host"
  nginx-conf-file = "nginx.prod.conf"
  elastic-ip-id = "eipalloc-0601463c"
}
