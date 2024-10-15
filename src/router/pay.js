import { Router } from "express";
import { checkJwt } from "../middleware/permission.js";
import {
  createPlanController,
  createProductController,
  getSuscriptionByIdController,
  payConfirmation,
  paySuscriptionController,
} from "../controllers/payController.js";

const router = Router();

router.post("/create-product", createProductController);
router.post("/create-plan", createPlanController);
router.get("/cancel-order", [checkJwt]);
router.post("/pay-suscription", [checkJwt], paySuscriptionController);
router.get("/suscription/:id", getSuscriptionByIdController);
router.post("/create-payment-intent", payConfirmation)
export default router;
