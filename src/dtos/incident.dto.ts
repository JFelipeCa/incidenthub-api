import { IncidentPriority, IncidentStatus } from "../models/incident.model";

export interface CreateIncidentDto {
  title: string;
  description: string;
  reporter: string;
  location: string;
  priority: IncidentPriority;
  estimatedMinutes: number;
}

export interface UpdateIncidentDto {
  title: string;
  description: string;
  location: string;
  priority: IncidentPriority;
  estimatedMinutes: number;
}

export interface UpdateStatusDto {
  status: IncidentStatus;
}
