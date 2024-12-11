# Définition des variables
$IMAGE_NAME = "tigre-front"
$VERSION = "1.0.0"

# Fonction pour la gestion des erreurs
function Handle-Error {
    param($message)
    Write-Host "Error: $message" -ForegroundColor Red
    exit 1
}

# Afficher les informations de build
Write-Host "Building version $VERSION of $IMAGE_NAME"

# Demander confirmation à l'utilisateur
$confirm = Read-Host "Do you want to proceed? (y/N)"
if ($confirm -notmatch '^[yY]$') {
    Write-Host "Operation cancelled by user."
    exit 1
}

# Build l'image Docker
Write-Host "Building Docker image $IMAGE_NAME`:$VERSION..."
docker build -t "$IMAGE_NAME`:$VERSION" .
if ($LASTEXITCODE -ne 0) {
    Handle-Error "Docker build failed!"
}

# Sauvegarder l'image Docker
Write-Host "Saving Docker image to $IMAGE_NAME$VERSION.tar..."
docker save -o "$IMAGE_NAME$VERSION.tar" "$IMAGE_NAME`:$VERSION"
if ($LASTEXITCODE -ne 0) {
    Handle-Error "Docker save failed!"
}

Write-Host "Deployment script completed successfully." -ForegroundColor Green
exit 0