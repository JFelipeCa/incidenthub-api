import { Incident } from "../models/incident.model";

export const incidents: Incident[] = [
  {
    id: 1,
    title: "Proyector sin señal",
    description: "El proyector no reconoce ningún computador conectado.",
    reporter: "Carlos Díaz",
    location: "Aula 201",
    priority: "MEDIUM",
    status: "OPEN",
    estimatedMinutes: 30,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Equipo sin acceso a Internet",
    description: "El computador del laboratorio perdió completamente la conexión.",
    reporter: "Laura Gómez",
    location: "Laboratorio 304",
    priority: "HIGH",
    status: "IN_PROGRESS",
    estimatedMinutes: 45,
    createdAt: "2026-09-18T14:30:00.000Z"
  },
  {
    id: 3,
    title: "Servidor de archivos caído",
    description: "Nadie puede acceder a las carpetas compartidas del área administrativa.",
    reporter: "Andrea Ruiz",
    location: "Cuarto de servidores",
    priority: "CRITICAL",
    status: "OPEN",
    estimatedMinutes: 60,
    createdAt: "2026-09-19T08:15:00.000Z"
  },
  {
    id: 4,
    title: "Impresora atascada",
    description: "La impresora del segundo piso no avanza el papel y muestra error de bandeja.",
    reporter: "Miguel Torres",
    location: "Piso 2",
    priority: "LOW",
    status: "RESOLVED",
    estimatedMinutes: 20,
    createdAt: "2026-09-17T10:00:00.000Z"
  },
  {
    id: 5,
    title: "Aplicación de nómina no abre",
    description: "Al iniciar la aplicación de nómina aparece un error y se cierra sola.",
    reporter: "Sofía Herrera",
    location: "Oficina 112",
    priority: "HIGH",
    status: "IN_PROGRESS",
    estimatedMinutes: 90,
    createdAt: "2026-09-19T11:45:00.000Z"
  }
];
