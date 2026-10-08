#!/usr/bin/env bash
set -u

BASE_URL="http://localhost:3000"
OUT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/salidas"
mkdir -p "$OUT_DIR"

run_case() {
  local num="$1"
  local name="$2"
  local expected_status="$3"
  local expected_fragment="$4"
  shift 4

  local headers_file="$OUT_DIR/$(printf '%02d' "$num")-${name}.headers"
  local body_file="$OUT_DIR/$(printf '%02d' "$num")-${name}.body"
  local result_file="$OUT_DIR/$(printf '%02d' "$num")-${name}.txt"

  curl -sS -D "$headers_file" -o "$body_file" "$@"

  local status
  status=$(awk 'NR==1 {print $2}' "$headers_file")
  local actual_body
  actual_body=$(tr -d '\r\n' < "$body_file")

  local match="FALLA"
  if [[ "$status" == "$expected_status" ]] && grep -Fq "$expected_fragment" <<< "$actual_body"; then
    match="OK"
  fi

  {
    printf 'Prueba %s: %s\n' "$num" "$name"
    printf 'Esperado: %s | %s\n' "$expected_status" "$expected_fragment"
    printf 'Obtenido: %s | %s\n' "$status" "$actual_body"
    printf 'Resultado: %s\n' "$match"
  } > "$result_file"

  cat "$result_file"
}

# Nota: reiniciar el servidor antes de correr este script,
# porque la prueba 17 elimina el incidente 4 (los datos viven en memoria).

run_case 15 delete-sin-token 401 '"Unauthorized"' -X DELETE "$BASE_URL/api/incidents/4"
run_case 16 delete-technician 403 '"Forbidden: admin only"' -X DELETE -H 'Authorization: Bearer technician-token' "$BASE_URL/api/incidents/4"
run_case 17 delete-instructor 204 '' -X DELETE -H 'Authorization: Bearer instructor-token' "$BASE_URL/api/incidents/4"
run_case 18 ruta-inexistente 404 '"Route not found"' -H 'Accept: application/json' "$BASE_URL/api/planets"
run_case 19 get-critical 200 '"priority":"CRITICAL"' -H 'Accept: application/json' "$BASE_URL/api/incidents/critical"
run_case 20 get-stats 200 '"averageEstimatedMinutes"' -H 'Accept: application/json' "$BASE_URL/api/incidents/stats"
