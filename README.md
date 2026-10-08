## Módulo de Middlewares y Validaciones (Laura - rama feat/middlewares)

Se implementó una arquitectura modular de 10 middlewares para garantizar la seguridad, trazabilidad, manejo global de errores y validación estricta de las peticiones HTTP.

### Explicación de cada Middleware

1. **loggerMiddleware (`src/middlewares/logger.middleware.ts`)**
   Registra en la consola la marca de tiempo en formato ISO, el método HTTP y la URL original (`req.originalUrl`). Es la primera línea de auditoría del servidor.

2. **requestInfoMiddleware (`src/middlewares/request-info.middleware.ts`)**
   Enriquece el objeto `req.requestInfo` con metadatos estandarizados: `timestamp`, `method` y `path` para uso en controladores o auditorías posteriores.

3. **authMiddleware (`src/middlewares/auth.middleware.ts`)**
   Inspecciona el encabezado `Authorization: Bearer <token>`. Asigna a `req.user` el rol `admin` si el token es `instructor-token` o `technician` si es `technician-token`. Si falta o es inválido, lanza `AppError(401, "Unauthorized")`.

4. **adminMiddleware (`src/middlewares/admin.middleware.ts`)**
   Verifica que `req.user.role === "admin"`. Si no lo es, lanza `AppError(403, "Forbidden: admin only")`. Protege operaciones destructivas como `DELETE`.

5. **validateId (`src/middlewares/validate-id.middleware.ts`)**
   Garantiza mediante expresión regular `/^\d+$/` que el parámetro `:id` sea un entero estrictamente positivo (> 0). Rechaza strings alfanuméricos, negativos o decimales con `AppError(400, "Invalid incident id")`.

6. **validateIncident (`src/middlewares/validate-incident.middleware.ts`)**
   Valida que `title`, `description` y `location` sean strings no vacíos. Exige el campo `reporter` únicamente en peticiones `POST` (creación) y lo omite en `PUT` (actualización). Exige presencia de `priority` y `estimatedMinutes`.

7. **validatePriority (`src/middlewares/validate-priority.middleware.ts`)**
   Valida que el campo `priority` coincida estrictamente con uno de los valores del tipo enum: `LOW`, `MEDIUM`, `HIGH` o `CRITICAL`.

8. **validateTime (`src/middlewares/validate-time.middleware.ts`)**
   Valida que `estimatedMinutes` sea un número positivo entre 1 y 480 (8 horas max). Además, ejecuta la regla del Reto 4: si la prioridad es `CRITICAL`, el tiempo no puede superar los 60 minutos.

9. **errorMiddleware (`src/middlewares/error.middleware.ts`)**
   Manejador centralizado de errores de Express (4 parámetros). Captura cualquier `AppError` lanzado en la aplicación y responde con el formato estándar `{ "ok": false, "message": "..." }` y su código HTTP. Atrapa errores no controlados enviando 500.

10. **notFoundMiddleware (`src/middlewares/not-found.middleware.ts`)**
    Captura peticiones a rutas que no existen en el router y lanza un `AppError(404, "Route not found")`.

---

### Sustentación Reto 4: Ubicación de la regla en `validateTime`
La regla que restringe los incidentes con prioridad `CRITICAL` a un máximo de 60 minutos de atención se implementó dentro de `validateTime` por las siguientes razones técnicas:
- **Responsabilidad Única:** Es una restricción cualitativa sobre la duración (`estimatedMinutes`).
- **Orden de la cadena de middlewares:** En la ruta `POST` y `PUT`, el orden de middlewares es `validateIncident` -> `validatePriority` -> `validateTime`. Al colocarse en `validateTime`, garantizamos que la prioridad ya fue validada como correcta previamente, evitando errores de evaluación o validaciones redundantes.

---

## Evidencias de Pruebas (Pruebas 15 a 20)

### Prueba 15: DELETE sin token de autenticación
- **Método y Ruta:** DELETE /api/incidents/1
- **Headers:** Ninguno
- **Status:** 401 Unauthorized
- **Respuesta:**
{
  "ok": false,
  "message": "Unauthorized"
}

### Prueba 16: DELETE con rol técnico (sin permisos de eliminación)
- **Método y Ruta:** DELETE /api/incidents/1
- **Headers:** Authorization: Bearer technician-token
- **Status:** 403 Forbidden
- **Respuesta:**
{
  "ok": false,
  "message": "Forbidden: admin only"
}

### Prueba 17: DELETE con rol administrador (eliminación exitosa)
- **Método y Ruta:** DELETE /api/incidents/1
- **Headers:** Authorization: Bearer instructor-token
- **Status:** 204 No Content
- **Respuesta:** Sin cuerpo de respuesta (Body vacío)

### Prueba 18: Petición a ruta inexistente
- **Método y Ruta:** GET /api/incidents/ruta-que-no-existe
- **Headers:** Ninguno
- **Status:** 404 Not Found
- **Respuesta:**
{
  "ok": false,
  "message": "Route not found"
}

### Prueba 19: Consulta de incidentes críticos
- **Método y Ruta:** GET /api/incidents/critical
- **Headers:** Ninguno (Ruta pública)
- **Status:** 200 OK
- **Respuesta:**
{
  "ok": true,
  "total": 1,
  "data": [
    {
      "id": 4,
      "title": "Fallo eléctrico en rack principal",
      "description": "Se cayó el switch central del Data Center",
      "reporter": "Laura Sánchez",
      "location": "Data Center",
      "priority": "CRITICAL",
      "status": "OPEN",
      "estimatedMinutes": 45,
      "createdAt": "2025-01-15T08:00:00.000Z"
    }
  ]
}

### Prueba 20: Consulta de estadísticas globales
- **Método y Ruta:** GET /api/incidents/stats
- **Headers:** Ninguno (Ruta pública)
- **Status:** 200 OK
- **Respuesta:**
{
  "ok": true,
  "data": {
    "total": 5,
    "byPriority": {
      "LOW": 1,
      "MEDIUM": 2,
      "HIGH": 1,
      "CRITICAL": 1
    },
    "byStatus": {
      "OPEN": 3,
      "IN_PROGRESS": 1,
      "RESOLVED": 1
    },
    "avgEstimatedMinutes": 52
  }
}