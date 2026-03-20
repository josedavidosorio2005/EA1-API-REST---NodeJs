#!/bin/bash
# Script de prueba de API REST

# Colores para salida
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000/api"

echo -e "${BLUE}=== Script de Prueba de API REST ===${NC}\n"

# Función para hacer request
function test_endpoint() {
  local method=$1
  local endpoint=$2
  local data=$3
  local description=$4
  
  echo -e "${BLUE}Test: ${description}${NC}"
  echo "Método: $method | Endpoint: $endpoint"
  
  if [ -z "$data" ]; then
    curl -X $method "$BASE_URL$endpoint" \
      -H "Content-Type: application/json" \
      -w "\nStatus: %{http_code}\n\n"
  else
    curl -X $method "$BASE_URL$endpoint" \
      -H "Content-Type: application/json" \
      -d "$data" \
      -w "\nStatus: %{http_code}\n\n"
  fi
}

# Pruebas de Géneros
echo -e "${GREEN}=== PRUEBAS DE GÉNEROS ===${NC}\n"

test_endpoint "GET" "/generos" "" "Obtener todos los géneros"

test_endpoint "POST" "/generos" \
  '{"nombre":"Acción","descripcion":"Películas de acción"}' \
  "Crear un novo género"

test_endpoint "GET" "/generos/1" "" "Obtener género por ID"

test_endpoint "PUT" "/generos/1" \
  '{"nombre":"Acción","descripcion":"Películas de acción actualizado"}' \
  "Actualizar género"

# Pruebas de Directores
echo -e "${GREEN}=== PRUEBAS DE DIRECTORES ===${NC}\n"

test_endpoint "GET" "/directores" "" "Obtener todos los directores"

test_endpoint "POST" "/directores" \
  '{"nombre":"Steven","apellido":"Spielberg","email":"steven@example.com","telefono":"+1-555-0100","pais":"Estados Unidos"}' \
  "Crear un novo director"

# Pruebas de Productoras
echo -e "${GREEN}=== PRUEBAS DE PRODUCTORAS ===${NC}\n"

test_endpoint "GET" "/productoras" "" "Obtener todas las productoras"

test_endpoint "POST" "/productoras" \
  '{"nombre":"Universal Pictures","pais":"Estados Unidos","email":"info@universal.com"}' \
  "Crear una nova productora"

# Pruebas de Tipos
echo -e "${GREEN}=== PRUEBAS DE TIPOS ===${NC}\n"

test_endpoint "GET" "/tipos" "" "Obtener todos los tipos"

test_endpoint "POST" "/tipos" \
  '{"nombre":"Película","descripcion":"Largometraje de cine"}' \
  "Crear un novo tipo"

# Pruebas de Media
echo -e "${GREEN}=== PRUEBAS DE MEDIA ===${NC}\n"

test_endpoint "GET" "/media" "" "Obtener todos los media"

echo -e "${GREEN}=== Pruebas Completadas ===${NC}"
