import { Router } from "express";
import {
  createIncident,
  deleteIncident,
  getAllIncidents,
  getCriticalIncidents,
  getIncidentById,
  getIncidentStats,
  getPendingIncidents,
  updateIncident,
  updateIncidentStatus,
} from "../controllers/incident.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { validateId } from "../middlewares/validate-id.middleware";
import { validateIncident } from "../middlewares/validate-incident.middleware";
import { validatePriority } from "../middlewares/validate-priority.middleware";
import { validateTime } from "../middlewares/validate-time.middleware";

const router = Router();

router.get("/", getAllIncidents);
router.get("/critical", getCriticalIncidents);
router.get("/pending", getPendingIncidents);
router.get("/stats", getIncidentStats);
router.get("/:id", validateId, getIncidentById);

router.post("/", authMiddleware, validateIncident, validatePriority, validateTime, createIncident);
router.put("/:id", authMiddleware, validateId, validateIncident, validatePriority, validateTime, updateIncident);
router.patch("/:id/status", authMiddleware, validateId, updateIncidentStatus);
router.delete("/:id", authMiddleware, adminMiddleware, validateId, deleteIncident);

export default router;
