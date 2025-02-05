# Picturas Project

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Installation and Setup](#installation-and-setup)
    - [Minikube Setup](#minikube-setup)
    - [Deploying the Application](#deploying-the-application)
5. [Accessing the Application](#accessing-the-application)
    - [Frontend](#frontend)
    - [API](#api)
    - [Mailhog](#mailhog)
6. [Stopping the Application](#stopping-the-application)
7. [Troubleshooting](#troubleshooting)
8. [License](#license)

---

## Project Overview
Picturas is a scalable web application designed to manage and showcase images effectively. It includes a frontend for user interaction, an API for backend services, and integrated email management with Mailhog. The project is deployed using Kubernetes, leveraging tools like Minikube and Helm for orchestration and package management.

## Features
- User-friendly web interface for managing images
- RESTful API for backend operations
- Integrated email management via Mailhog
- Deployable on Kubernetes clusters using Helm

## Prerequisites
Before you begin, ensure you have the following installed on your system:

1. [Minikube](https://minikube.sigs.k8s.io/docs/start/)
2. [Helm](https://helm.sh/docs/intro/install/)
3. Docker

---

## Installation and Setup

### Minikube Setup
1. Start Minikube:
   ```bash
   minikube start
   ```
2. Enable required Minikube addons:
   ```bash
   minikube addons enable ingress
   minikube addons enable metrics-server
   ```
3. Optionally, launch the Minikube dashboard to monitor the deployment:
   ```bash
   minikube dashboard
   ```
4. Configure the Docker environment to use Minikube's Docker daemon:
   ```bash
   eval $(minikube docker-env)
   ```

### Deploying the Application
1. Build the Docker images:
   ```bash
   ./scripts/build-docker.sh
   ```
2. Deploy the application using Helm:
   ```bash
   helm install picturas ./picturas-chart
   ```
3. Retrieve the IP address for the ingress controller:
   ```bash
   minikube kubectl -- get ingress
   ```
   Note: It may take a few minutes for the IP to become available.

---

## Accessing the Application
Once the deployment is complete, you can access the various components of the application:

### Frontend
The frontend interface is accessible at:
```
http://<IP_ADDRESS>
```
Replace `<IP_ADDRESS>` with the ingress IP obtained in the previous step.

### API
The API can be accessed at:
```
http://<IP_ADDRESS>/api
```

### Mailhog
Mailhog, used for email management, can be accessed at:
```
http://<IP_ADDRESS>/mailhog
```

---

## Stopping the Application
To stop the application and free up resources:
1. Uninstall the Helm release:
   ```bash
   helm uninstall picturas
   ```
2. Stop Minikube:
   ```bash
   minikube stop
   ```
3. Restart your terminal to reset the Docker environment:
   ```bash
   # Close and reopen your terminal
   ```

---

## Troubleshooting
- If the ingress IP does not appear after a few minutes, ensure that the ingress addon is enabled and the resources are deployed correctly.
- Use the `minikube dashboard` or `kubectl` commands to check the status of pods, services, and ingress resources.
- Ensure Docker is correctly configured to use Minikube's environment by running `eval $(minikube docker-env)`.

---

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
