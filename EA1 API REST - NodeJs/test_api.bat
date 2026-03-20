@echo off
REM Script de prueba de API REST para Windows

echo.
echo ===== Script de Prueba de API REST =====
echo.

setlocal enabledelayedexpansion
set BASE_URL=http://localhost:3000/api

REM Pruebas de Géneros
echo ===== PRUEBAS DE GÉNEROS =====
echo.
echo Test: Obtener todos los géneros
curl -i -X GET "%BASE_URL%/generos"
echo.
echo.

echo Test: Crear un novo género
curl -i -X POST "%BASE_URL%/generos" ^
  -H "Content-Type: application/json" ^
  -d "{\"nombre\":\"Acción\",\"descripcion\":\"Películas de acción\"}"
echo.
echo.

echo Test: Obtener género por ID
curl -i -X GET "%BASE_URL%/generos/1"
echo.
echo.

REM Pruebas de Directores
echo ===== PRUEBAS DE DIRECTORES =====
echo.
echo Test: Obtener todos los directores
curl -i -X GET "%BASE_URL%/directores"
echo.
echo.

echo Test: Crear un novo director
curl -i -X POST "%BASE_URL%/directores" ^
  -H "Content-Type: application/json" ^
  -d "{\"nombre\":\"Steven\",\"apellido\":\"Spielberg\",\"email\":\"steven@example.com\",\"telefono\":\"+1-555-0100\",\"pais\":\"Estados Unidos\"}"
echo.
echo.

REM Pruebas de Productoras
echo ===== PRUEBAS DE PRODUCTORAS =====
echo.
echo Test: Obtener todas las productoras
curl -i -X GET "%BASE_URL%/productoras"
echo.
echo.

echo Test: Crear una nova productora
curl -i -X POST "%BASE_URL%/productoras" ^
  -H "Content-Type: application/json" ^
  -d "{\"nombre\":\"Universal Pictures\",\"pais\":\"Estados Unidos\",\"email\":\"info@universal.com\"}"
echo.
echo.

REM Pruebas de Tipos
echo ===== PRUEBAS DE TIPOS =====
echo.
echo Test: Obtener todos los tipos
curl -i -X GET "%BASE_URL%/tipos"
echo.
echo.

echo Test: Crear un novo tipo
curl -i -X POST "%BASE_URL%/tipos" ^
  -H "Content-Type: application/json" ^
  -d "{\"nombre\":\"Película\",\"descripcion\":\"Largometraje de cine\"}"
echo.
echo.

REM Pruebas de Media
echo ===== PRUEBAS DE MEDIA =====
echo.
echo Test: Obtener todos los media
curl -i -X GET "%BASE_URL%/media"
echo.
echo.

echo ===== Pruebas Completadas =====
pause
