#!/bin/bash
set -e
echo "$SSH_PRIVATE_KEY" > private_key
chmod 0600 private_key

# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
mv kubectl /usr/local/bin/

# Install Helm
curl -fsSL https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Bind Ports
ssh -o StrictHostKeyChecking=no -f -N -L 6443:127.0.0.1:6443 $SSH_USER@$SSH_HOST -p $SSH_PORT -i private_key &
sleep 5

# Configure docker
docker context create server-remote --docker "host=ssh://$SSH_USER@$SSH_HOST:$SSH_PORT" --docker "ssh.key=private_key"
docker context use server-remote

# Config Kubernetes
mkdir $HOME/.kube
ssh -o StrictHostKeyChecking=no $SSH_USER@$SSH_HOST -p $SSH_PORT -i private_key 'cat $HOME/.kube/config' > $HOME/.kube/config
sed -i 's/127.0.0.1:[0-9]\+/localhost:6443/g' $HOME/.kube/config
export KUBECONFIG=$HOME/.kube/config

# Build Images
docker system prune --all -y

# Helm uninstall
helm uninstall picturas
