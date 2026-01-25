#!/bin/bash

# Exit on any error
set -e

echo "=========================================="
echo "Installing Docker on Ubuntu"
echo "=========================================="

# 1. Update existing packages
echo "Updating package database..."
sudo apt-get update

# 2. Install prerequisite packages
echo "Installing prerequisites..."
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# 3. Add Docker's official GPG key
echo "Adding Docker GPG key..."
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 4. Set up the repository
echo "Setting up Docker repository..."
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 5. Install Docker Engine
echo "Installing Docker..."
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 6. Install Docker Compose (standalone) - optional but useful
# echo "Installing Docker Compose..."
# sudo apt-get install -y docker-compose-plugin

# 7. Add current user to docker group so you don't need sudo
echo "Adding user '$USER' to docker group..."
sudo usermod -aG docker $USER

echo "=========================================="
echo "Installation complete!"
echo "IMPORTANT: You must LOG OUT and LOG BACK IN for the group changes to take effect."
echo "=========================================="
