#!/usr/bin/env bash
# Arma dist/ solo con los archivos públicos de la tienda.
# Firebase lo ejecuta antes de cada despliegue (predeploy en firebase.json),
# así nunca se suben archivos sueltos que haya en la carpeta.
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf dist
mkdir -p dist
cp index.html admin.html 404.html manifest.json sw.js dist/
cp -r css js img dist/
echo "dist/ listo: $(find dist -type f | wc -l) archivos"
