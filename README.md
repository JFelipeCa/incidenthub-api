# IncidentHub API

## Problema que soluciona

IncidentHub API centraliza la gestión de incidentes tecnológicos de una organización (computadores que no encienden, fallas de conectividad, impresoras, etc.). Permite registrar, consultar, actualizar, atender y eliminar incidentes con validaciones, autenticación y manejo uniforme de errores, en lugar de reportarlos por llamadas y mensajes informales.

## Tecnologías

- Node.js
- Express
- TypeScript

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm run dev
```

El servidor queda en `http://localhost:3000`.

## Documentación de endpoints

<!-- INICIO: ENDPOINTS -->

Base: `/api/incidents`. Los datos viven en memoria (se reinician al apagar el servidor).

| Método | Ruta | Acceso | Respuesta |
|---|---|---|---|
| GET | `/` | Público | 200 `{ ok, total, data }` |
| GET | `/critical` | Público | 200 `{ ok, total, data }` (solo prioridad CRITICAL) |
| GET | `/pending` | Público | 200 `{ ok, total, data }` (OPEN o IN_PROGRESS) |
| GET | `/stats` | Público | 200 `{ ok, data: { total, open, inProgress, resolved, critical, averageEstimatedMinutes } }` |
| GET | `/:id` | Público | 200 `{ ok, data }` / 400 / 404 |
| POST | `/` | Técnico o instructor | 201 `{ ok, data }` (id automático, status OPEN, createdAt ISO) |
| PUT | `/:id` | Técnico o instructor | 200 `{ ok, data }` / 400 / 404 |
| PATCH | `/:id/status` | Técnico o instructor | 200 `{ ok, data }` / 400 / 404 |
| DELETE | `/:id` | Solo instructor (admin) | 204 sin body / 401 / 403 / 404 |

Autenticación: encabezado `Authorization: Bearer instructor-token` (admin) o `Authorization: Bearer technician-token` (técnico).

Los errores salen siempre así: `{ "ok": false, "message": "..." }`.

### Regla de transiciones de estado (PATCH `/:id/status`)

| Estado actual | Puede pasar a |
|---|---|
| OPEN | IN_PROGRESS, RESOLVED |
| IN_PROGRESS | RESOLVED |
| RESOLVED | nada (400) |

Un `status` fuera de OPEN, IN_PROGRESS o RESOLVED responde 400. `averageEstimatedMinutes` va redondeado y es 0 si no hay incidentes.

<!-- FIN: ENDPOINTS -->

## Explicación de cada middleware

<!-- INICIO: MIDDLEWARES -->

1. **loggerMiddleware** (`logger.middleware.ts`): registra en consola la fecha en formato ISO, el método HTTP y la URL de cada petición.
2. **requestInfoMiddleware** (`request-info.middleware.ts`): agrega `req.requestInfo` con `timestamp`, `method` y `path`, para demostrar que un middleware puede enriquecer la petición.
3. **authMiddleware** (`auth.middleware.ts`): lee `Authorization: Bearer <token>`. Si es `instructor-token` asigna el rol admin; si es `technician-token`, el rol técnico. Si falta o es incorrecto, responde 401.
4. **adminMiddleware** (`admin.middleware.ts`): deja pasar solo al rol admin. Si no, responde 403. Protege el DELETE.
5. **validateId** (`validate-id.middleware.ts`): revisa que `:id` sea un número entero positivo (rechaza `abc`, `-3` y `4.5`) y responde 400 si no.
6. **validateIncident** (`validate-incident.middleware.ts`): revisa que `title`, `description` y `location` sean textos no vacíos, que `priority` y `estimatedMinutes` vengan en la petición, y que `reporter` venga solo al crear (POST).
7. **validatePriority** (`validate-priority.middleware.ts`): solo permite LOW, MEDIUM, HIGH y CRITICAL; cualquier otro valor responde 400.
8. **validateTime** (`validate-time.middleware.ts`): `estimatedMinutes` debe ser numérico, mayor que 0 y como máximo 480. Aquí también está la regla del Reto 4: si la prioridad es CRITICAL, no puede pasar de 60 minutos.
9. **errorMiddleware** (`error.middleware.ts`): recibe todos los errores y responde con el formato `{ ok: false, message }` y el código del `AppError`. Si el error no es controlado, responde 500.
10. **notFoundMiddleware** (`not-found.middleware.ts`): si la ruta no existe, genera un error 404 "Route not found".

**Orden en la app:** logger → requestInfo → `express.json()` → rutas (auth → admin cuando aplica → validateId → validateIncident → validatePriority → validateTime → controller) → notFound → error.

<!-- FIN: MIDDLEWARES -->

### Reto 4: ¿por qué la regla de CRITICAL va en `validateTime`?

Porque es una regla sobre los minutos estimados. Además, en la cadena de POST y PUT `validatePriority` corre antes, así que cuando `validateTime` revisa la regla, ya sabemos que la prioridad es válida.

## DTO vs Model

El **Model** (`Incident`) es cómo existe un incidente dentro de la aplicación: tiene todos los campos, incluidos `id`, `status` y `createdAt`. El **DTO** (`CreateIncidentDto`) es solo lo que el cliente puede mandar cuando crea un incidente: título, descripción, quién reporta, ubicación, prioridad y minutos estimados.

Los separamos para que el cliente no pueda inventar su propio `id`, `status` ni fecha: esos los pone el servidor (id automático, status `OPEN` y `createdAt` con la fecha actual). Para actualizar usamos otro DTO (`UpdateIncidentDto`) sin `reporter`, porque quien reportó no se cambia. Así cada operación acepta solo los datos que le corresponden y el código queda más claro y fácil de mantener.

## Reflexión final

Usar middlewares para las validaciones, la autenticación y el manejo de errores, en vez de meter todo en cada controller, nos ahorra repetir el mismo código una y otra vez. Por ejemplo, `validateId` lo escribimos una sola vez y lo usamos en varias rutas; si lo hubiéramos puesto en cada controller, habría que copiarlo y corregirlo en todos lados. Así el controller se encarga solo de lo suyo (crear, buscar, actualizar) y no de revisar tokens o datos. Además, los errores salen siempre con el mismo formato porque todos pasan por un solo `errorMiddleware`, y si hay que cambiar algo, se cambia en un solo archivo. En resumen, el proyecto queda más ordenado, más fácil de mantener y de probar.

## Evidencias

Las evidencias de las pruebas realizadas están en la carpeta `evidencias/`.