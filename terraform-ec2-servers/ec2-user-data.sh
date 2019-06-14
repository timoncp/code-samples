#!/bin/bash

# log the output of this file to /var/log/user-data.log
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

# format and mount the DB volume
mkfs -t ext4 /dev/xvdf
mkdir /db-drive
mount /dev/xvdf /db-drive
echo "/dev/xvdf   /db-drive   ext4    defaults,nofail  0   2" >> /etc/fstab
mount -a

# start-up scripts
echo 'service nginx restart' >> /etc/rc.d/rc.local
echo 'service docker restart' >> /etc/rc.d/rc.local
