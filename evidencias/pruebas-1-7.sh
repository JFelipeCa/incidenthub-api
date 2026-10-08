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

run_case 1 get-todos 200 '"ok":true' -H 'Accept: application/json' "$BASE_URL/api/incidents"
run_case 2 get-existing 200 '"id":1' -H 'Accept: application/json' "$BASE_URL/api/incidents/1"
run_case 3 get-missing 404 '"Incident not found"' -H 'Accept: application/json' "$BASE_URL/api/incidents/999"
run_case 4 get-invalid-id 400 '"Invalid incident id"' -H 'Accept: application/json' "$BASE_URL/api/incidents/abc"
run_case 5 post-valid 201 '"status":"OPEN"' -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer instructor-token' -d '{"title":"Router sin conectividad","description":"El router del segundo piso perdió conexión.","reporter":"Ana Torres","location":"Piso 2","priority":"HIGH","estimatedMinutes":40}' "$BASE_URL/api/incidents"
run_case 6 post-missing-title 400 '"Title is required and must be a non-empty string"' -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer instructor-token' -d '{"description":"El router del segundo piso perdió conexión.","reporter":"Ana Torres","location":"Piso 2","priority":"HIGH","estimatedMinutes":40}' "$BASE_URL/api/incidents"
run_case 7 post-invalid-priority 400 '"Invalid priority. Must be LOW, MEDIUM, HIGH, or CRITICAL"' -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer instructor-token' -d '{"title":"Router sin conectividad","description":"El router del segundo piso perdió conexión.","reporter":"Ana Torres","location":"Piso 2","priority":"SUPER_IMPORTANT","estimatedMinutes":40}' "$BASE_URL/api/incidents"
