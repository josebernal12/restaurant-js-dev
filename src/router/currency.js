import { Router } from "express";
import {
  currencyController,
  saveCurrencyInDBController,
  updateCurrencInDBController,
} from "../controllers/currencyController.js";

const router = Router();

router.put("/", currencyController);
router.get("/save-currency", saveCurrencyInDBController);
router.get('/update-currency', updateCurrencInDBController)
export default router;
