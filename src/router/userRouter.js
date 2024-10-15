import { Router } from "express";
import {
  changeModeController,
  createUserController,
  deleteManyUsersController,
  deleteUserController,
  getUserByIdController,
  getUsersController,
  logoutController,
  manyUsersController,
  obtainUserByToken,
  renewToken,
  tokenIsValidController,
  updateUserController,
  uploadExcelController,
  usersWithoutPasswordController,
} from "../controllers/userController.js";
import { checkJwt } from "../middleware/permission.js";

const router = Router();
router.get("/users", [checkJwt], getUsersController);
router.get("/users/:id", [checkJwt], getUserByIdController);
router.put("/users/update/:id", [checkJwt], updateUserController);
router.delete("/users/delete/:id", [checkJwt], deleteUserController);
router.post("/renew-token/:id", renewToken);
router.get("/logout", logoutController);
router.get("/obtain-user", [checkJwt], obtainUserByToken);
router.post("/create-user", [checkJwt], createUserController);
router.delete("/delete-manyUsers", [checkJwt], deleteManyUsersController);
router.post("/upload-excel", [checkJwt], uploadExcelController);
router.put('/change-mode/:id', changeModeController)
router.post("/many-users", [checkJwt], manyUsersController);
router.get("/user-withoutPassword", usersWithoutPasswordController);
router.get("/tokenValid/:token", tokenIsValidController);
export default router;
