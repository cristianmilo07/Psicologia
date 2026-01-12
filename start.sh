#!/bin/bash

echo "========================================"
echo "   Iniciando ARENYS CONTIGO "
echo "========================================"
echo ""

echo "[1/2] Iniciando Backend en puerto 3000..."
gnome-terminal -- bash -c "cd backend && npm start; exec bash" &
sleep 3

echo ""
echo "[2/2] Iniciando Frontend en puerto 4200..."
gnome-terminal -- bash -c "cd frontend && ng serve; exec bash" &

echo ""
echo "========================================"
echo "   Servidores iniciados"
echo "========================================"
echo "Backend:  http://localhost:3000"
echo "Frontend: http://localhost:4200"
echo ""

