import { Router } from "express";
import {
  addClientController,
  deleteClientController,
  getClientByIdController,
  getClientsController,
  updateClientController,
} from "../controllers/clientController.js";

const router = Router();

router.post("/", addClientController);
router.put("/:id", updateClientController);
router.get("/", getClientsController);
router.delete("/:id", deleteClientController);
router.get("/:id", getClientByIdController);
export default router;
