#!/usr/bin/env bash
set -euo pipefail

echo "[setup] Atualizando pacotes e instalando dependências..."
sudo apt-get update -y
sudo apt-get install -y zip
echo "[setup] Setup concluído."
