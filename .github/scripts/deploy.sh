#!/bin/bash
set -e
mkdir ~/.ssh
echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
chmod 0600 ~/.ssh/id_rsa
ssh-keyscan -H $SSH_HOST > ~/.ssh/known_hosts

# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
mv kubectl /usr/local/bin/

# Install Helm
curl -fsSL https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Bind Ports
ssh -o StrictHostKeyChecking=no -f -N -L 6443:127.0.0.1:6443 $SSH_USER@$SSH_HOST -p $SSH_PORT &
sleep 5

# Configure docker
docker context create server-remote --docker "host=ssh://$SSH_USER@$SSH_HOST:$SSH_PORT"
docker context use server-remote

# Config Kubernetes
mkdir $HOME/.kube
ssh -o StrictHostKeyChecking=no $SSH_USER@$SSH_HOST -p $SSH_PORT 'cat $HOME/.kube/config' > $HOME/.kube/config
sed -i 's/\([0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\)/localhost/' ~/.kube/config
export KUBECONFIG=$HOME/.kube/config

# Build Images
bash scripts/build-docker.sh

# Helm install
helm upgrade --install picturas ./picturas-chart -f values-production.yaml
