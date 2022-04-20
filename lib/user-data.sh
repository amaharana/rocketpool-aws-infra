#!/bin/bash

sudo dd if=/dev/zero of=/swapfile bs=1G count=16 status=progress
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# TODO: this throws the error "-bash: /etc/fstab: Permission denied" - need to fix
sudo echo "/swapfile                            none            swap    sw              0       0" >> /etc/fstab

sudo sysctl vm.swappiness=6
sudo sysctl vm.vfs_cache_pressure=10

# TODO: this throws the error "-bash: /etc/fstab: Permission denied" - need to fix
sudo echo "vm.swappiness=6" >> /etc/sysctl.conf
sudo echo "vm.vfs_cache_pressure=10" >> /etc/sysctl.conf
