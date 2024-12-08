@echo off
setlocal enabledelayedexpansion

REM Définir les variables
set "IMAGE_NAME=tigre-front"
set "VERSION=1.0.0"

REM Demander confirmation à l'utilisateur
echo Building version %VERSION% of %IMAGE_NAME%
set /P CONFIRM="Do you want to proceed? (y/no): "

if /I "%CONFIRM%" NEQ "y" (
    echo Operation cancelled by user.
    exit /B 1
)

REM Build l'image Docker
echo Building Docker image %IMAGE_NAME%:%VERSION%...
docker build -t %IMAGE_NAME%:%VERSION% .
if errorlevel 1 (
    echo Docker build failed!
    exit /B 1
)

REM Sauvegarder l'image Docker
echo Saving Docker image to %IMAGE_NAME%.tar...
docker save -o %IMAGE_NAME%.tar %IMAGE_NAME%:%VERSION%
if errorlevel 1 (
    echo Docker save failed!
    exit /B 1
)

echo Deployment script completed successfully.
endlocal
exit /B 0