import { Router } from "express";
import { checkJwt } from "../middleware/permission.js";
import {
  createTableController,
  deleteTableController,
  getTableByIdController,
  getTablesController,
} from "../controllers/tableController.js";
import checkTrialPeriod from "../middleware/checkTrialPeriod.js";

const router = Router();
//TODO AGREGAR [checkJwt] A LAS RUTAS
// router.use(checkTrialPeriod)
router.post("/", createTableController);
router.get("/", [checkJwt], getTablesController);
router.get("/:id", [checkJwt], getTableByIdController);
router.delete("/:id", [checkJwt], deleteTableController);
export default router;
