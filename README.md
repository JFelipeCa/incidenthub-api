# incidenthub-api

## Controller de incidentes (`incident.controller.ts`)

Base: `/api/incidents`. GET es público; POST, PUT y PATCH requieren `Authorization: Bearer <token>`; DELETE solo admin (`instructor-token`).

| Método | Ruta | Handler | Respuesta |
|---|---|---|---|
| GET | `/` | getAllIncidents | 200 `{ ok, total, data }` |
| GET | `/critical` | getCriticalIncidents | 200 `{ ok, total, data }` (solo prioridad CRITICAL) |
| GET | `/pending` | getPendingIncidents | 200 `{ ok, total, data }` (OPEN o IN_PROGRESS) |
| GET | `/stats` | getIncidentStats | 200 `{ ok, data: { total, open, inProgress, resolved, critical, averageEstimatedMinutes } }` |
| GET | `/:id` | getIncidentById | 200 `{ ok, data }` / 404 |
| POST | `/` | createIncident | 201 `{ ok, data }` (id = max id + 1, status OPEN, createdAt ISO) |
| PUT | `/:id` | updateIncident | 200 `{ ok, data }` / 404 (solo title, description, location, priority, estimatedMinutes) |
| PATCH | `/:id/status` | updateIncidentStatus | 200 `{ ok, data }` / 400 / 404 |
| DELETE | `/:id` | deleteIncident | 204 sin body / 404 |

Los errores se lanzan con `AppError` y los formatea `errorMiddleware`: `{ "ok": false, "message": "..." }`.

### Regla de transiciones de estado (PATCH `/:id/status`)

| Estado actual | Puede pasar a |
|---|---|
| OPEN | IN_PROGRESS, RESOLVED |
| IN_PROGRESS | RESOLVED |
| RESOLVED | nada (400) |

Un `status` fuera de OPEN, IN_PROGRESS o RESOLVED responde 400. Cualquier transición no listada (incluido repetir el mismo estado) responde 400 con mensaje claro.

`averageEstimatedMinutes` va redondeado y es 0 si no hay incidentes.

### Evidencias de pruebas (8 a 14)

| # | Prueba | Esperado | Obtenido |
|---|---|---|---|
| 8 | POST estimatedMinutes negativo | 400 | 400 {"ok": false,"message": "..."} | 
| 9 | POST CRITICAL > 60 min | 400 | 400 {"ok": false,"message": "..."} |
| 10 | PUT incidente existente | 200 | 200 OK json {"ok": true,"data": {"id": 1,"title": "Pantalla sin imagen","description": "El monitor dejó completamente de mostrar imagen.","reporter": "Carlos Díaz","location": "Oficina 407","priority": "HIGH","status": "OPEN","estimatedMinutes": 60,"createdAt": "..."}} |
| 11 | PUT incidente inexistente | 404 | Código: 404 Not Found json {"ok": false,"message": "Incident not found"}) |
| 12 | PATCH OPEN → IN_PROGRESS | 200 |  200 OK json { "ok": true,"data": {"id": 1,"status": " RESOLVED","...": "resto de campos del incidente"}} |
| 14 | PATCH RESOLVED → OPEN | 400 | 400 Bad Request json { "ok": false,"message": "..."} |
