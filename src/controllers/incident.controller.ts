import { Request, Response } from "express";
import { incidents } from "../data/incidents.data";
import { AppError } from "../errors/app-error";
import { CreateIncidentDto, UpdateIncidentDto } from "../dtos/incident.dto";
import { Incident } from "../models/incident.model";

export const getAllIncidents = (_req: Request, res: Response) => {
  res.json({ ok: true, total: incidents.length, data: incidents });
};

export const getIncidentById = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const incident = incidents.find((i) => i.id === id);

  if (!incident) {
    throw new AppError(404, "Incident not found");
  }

  res.json({ ok: true, data: incident });
};

export const createIncident = (req: Request, res: Response) => {
  const body = (req.body ?? {}) as CreateIncidentDto;

  const newId =
    incidents.length > 0 ? Math.max(...incidents.map((i) => i.id)) + 1 : 1;

  const newIncident: Incident = {
    id: newId,
    title: body.title,
    description: body.description,
    reporter: body.reporter,
    location: body.location,
    priority: body.priority,
    status: "OPEN",
    estimatedMinutes: body.estimatedMinutes,
    createdAt: new Date().toISOString(),
  };

  incidents.push(newIncident);

  res.status(201).json({ ok: true, data: newIncident });
};

export const updateIncident = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const incident = incidents.find((i) => i.id === id);

  if (!incident) {
    throw new AppError(404, "Incident not found");
  }

  const body = (req.body ?? {}) as UpdateIncidentDto;

  incident.title = body.title;
  incident.description = body.description;
  incident.location = body.location;
  incident.priority = body.priority;
  incident.estimatedMinutes = body.estimatedMinutes;

  res.json({ ok: true, data: incident });
};

export const deleteIncident = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = incidents.findIndex((i) => i.id === id);

  if (index === -1) {
    throw new AppError(404, "Incident not found");
  }

  incidents.splice(index, 1);

  res.status(204).send();
};