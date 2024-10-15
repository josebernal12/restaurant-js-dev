import { Router } from "express";
import {
  authGoogleController,
  changePasswordController,
  checkTokenEmailController,
  loginController,
  registerController,
  restorePasswordController,
} from "../controllers/authController.js";
const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/restore-password", restorePasswordController);
router.get("/check-token/:token", checkTokenEmailController);
router.post("/changePassword/:token", changePasswordController);
router.post("/auth-google", authGoogleController);

export default router;
