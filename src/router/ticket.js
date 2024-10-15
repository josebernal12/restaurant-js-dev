import { Router } from "express";
import { checkJwt } from "../middleware/permission.js";
import {
  cancelTicketController,
  completedAllProductTicketController,
  completedProductController,
  createMultipleTicketsControlller,
  createTicketController,
  deleteProductTicketController,
  deleteTicketController,
  finishedTicketController,
  getAllTicketsController,
  getTicketsByIdController,
  getTicketsController,
  joinAllProductsTicketController,
  receivedTicketController,
  ticketProcessController,
  updateTableTicketController,
  updateTicketClientController,
  updateTicketController,
  updateTicketTypeController,
  updateWaiterTicketController,
} from "../controllers/ticketController.js";
import checkTrialPeriod from "../middleware/checkTrialPeriod.js";

const router = Router();
// router.use(checkTrialPeriod)

router.post("/join-product", [checkJwt], joinAllProductsTicketController);
router.post("/:id", createTicketController);
router.put("/update/:id", [checkJwt], updateTicketController);
router.get("/", [checkJwt], getTicketsController);
router.delete("/delete/:id", [checkJwt], deleteTicketController);
router.delete("/cancel/:id", [checkJwt], cancelTicketController);
router.put("/received/:id", [checkJwt], receivedTicketController);
router.put("/finished/:id", [checkJwt], finishedTicketController);
router.put("/completed/:id", [checkJwt], completedProductController);
router.put(
  "/complete-all/:id",
  [checkJwt],
  completedAllProductTicketController
);
router.get("/tickets", [checkJwt], getAllTicketsController);
router.post(
  "/create/multiple-tickets",
  [checkJwt],
  createMultipleTicketsControlller
);
router.get("/:id", [checkJwt], getTicketsByIdController);
router.patch("/updateTable/:id", [checkJwt], updateTableTicketController);
router.patch("/updateWaiter/:id", [checkJwt], updateWaiterTicketController);
router.patch("/updateType/:id", updateTicketTypeController);
router.patch("/updateClient/:id", updateTicketClientController)
router.put("/updateProcess/:id", [checkJwt], ticketProcessController);
router.delete(
  "/deleteProductTicket/:id",
  [checkJwt],
  deleteProductTicketController
);
export default router;
