# Evidencias de pruebas

Este directorio reúne la evidencia de las pruebas del endpoint `/api/incidents`.

| Pruebas | Script |
| --- | --- |
| 1 a 7 | `pruebas-1-7.sh` |
| 15 a 20 | `pruebas-15-20.sh` |

- Salidas: `salidas/NN-nombre.txt` (resumen), más `.headers` (encabezados de la respuesta) y `.body` (cuerpo de la respuesta).
- El servidor debe arrancar antes de ejecutar cada script, y conviene reiniciarlo entre scripts porque los datos viven en memoria (la prueba 17 elimina el incidente 4).
