import { Request, Response } from "express";
import { incidents } from "../data/incidents.data";
import { AppError } from "../errors/app-error";
import {
  CreateIncidentDto,
  UpdateIncidentDto,
  UpdateStatusDto,
} from "../dtos/incident.dto";
import { Incident, IncidentStatus } from "../models/incident.model";

const VALID_STATUSES: IncidentStatus[] = ["OPEN", "IN_PROGRESS", "RESOLVED"];

// Transiciones permitidas: estado actual -> estados a los que puede pasar
const ALLOWED_TRANSITIONS: Record<IncidentStatus, IncidentStatus[]> = {
  OPEN: ["IN_PROGRESS", "RESOLVED"],
  IN_PROGRESS: ["RESOLVED"],
  RESOLVED: [],
};

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

export const updateIncidentStatus = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { status } = (req.body ?? {}) as Partial<UpdateStatusDto>;

  if (!status || !VALID_STATUSES.includes(status)) {
    throw new AppError(
      400,
      "Invalid status. Allowed values: OPEN, IN_PROGRESS, RESOLVED"
    );
  }

  const incident = incidents.find((i) => i.id === id);

  if (!incident) {
    throw new AppError(404, "Incident not found");
  }

  if (!ALLOWED_TRANSITIONS[incident.status].includes(status)) {
    if (incident.status === "RESOLVED") {
      throw new AppError(
        400,
        `A RESOLVED incident cannot be changed to ${status}`
      );
    }
    throw new AppError(
      400,
      `Invalid status transition from ${incident.status} to ${status}`
    );
  }

  incident.status = status;

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