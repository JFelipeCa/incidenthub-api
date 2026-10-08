# IncidentHub API

## Problema que soluciona

IncidentHub API centraliza la gestión de incidentes de infraestructura y operaciones para registrar, consultar y actualizar eventos críticos con validaciones, autenticación y manejo uniforme de errores.

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

## Documentación de endpoints

<!-- INICIO: ENDPOINTS (Dayana) -->

| Método | Ruta | Descripción |
| --- | --- | --- |
|  |  |  |

<!-- FIN: ENDPOINTS -->

## Explicación de cada middleware

<!-- INICIO: MIDDLEWARES (Laura) -->

- loggerMiddleware
- requestInfoMiddleware
- authMiddleware
- adminMiddleware
- validateId
- validateIncident
- validatePriority
- validateTime
- errorMiddleware
- notFoundMiddleware

<!-- FIN: MIDDLEWARES -->

## DTO vs Model

<!-- PENDIENTE: Felipe -->

- ¿Qué diferencia existe entre un DTO y un modelo en una API REST?
- ¿Cuándo conviene validar los datos de entrada en un DTO en lugar de hacerlo directamente en el modelo?
- ¿Qué ventajas aporta separar la estructura de datos del contrato de entrada y salida?
- ¿Cómo mejora la mantenibilidad del código mantener tipos claros para la entidad y para los datos que recibe la petición?

## Reflexión final

<!-- PENDIENTE: Felipe -->

- ¿Qué ventajas ofrece implementar validaciones, autenticación y manejo de errores mediante middlewares en lugar de escribir toda esta lógica directamente dentro de cada controller?
