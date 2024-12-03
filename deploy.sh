#!/bin/bash

# Variables
DOCKER_REPO="badzim/codelands"
APP_NAME="dpr-client" # Nom de votre application
VERSION=${1:-"0.0"} # Utilise le paramètre passé ou "latest" par défaut

echo "=================================================="
echo "🚀 Starting Deployment Script for Version $VERSION"
echo "=================================================="

# Construire l'application Vue.js
echo "🛠️  Building Vue.js application..."
npm install
npm run build

# Construire et pousser les images Docker
echo "🛠️  Building Docker image for $APP_NAME version $VERSION..."
docker build -t $DOCKER_REPO:$APP_NAME-v$VERSION -f ./docker/Dockerfile .

echo "🏷️  Tagging Docker image as latest..."
docker tag $DOCKER_REPO:$APP_NAME-v$VERSION $DOCKER_REPO:$APP_NAME-latest

echo "📤 Pushing Docker image version $VERSION..."
docker push $DOCKER_REPO:$APP_NAME-v$VERSION

echo "📤 Pushing Docker image as latest..."
docker push $DOCKER_REPO:$APP_NAME-latest

# Nettoyage
echo "🧹 Cleaning up local Docker images..."
docker rmi $DOCKER_REPO:$APP_NAME-v$VERSION $DOCKER_REPO:$APP_NAME-latest || true

echo "🧹 Cleaning up local dist folder..."
rm -rfd ./dist

echo "=================================================="
echo "✅ Deployment Completed Successfully!"
echo "=================================================="
