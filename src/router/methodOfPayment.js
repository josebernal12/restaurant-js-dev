import { Router } from 'express'
import {
    findMethodOfPaymentByCompanyController,
    quantitySellMethodOfPaymentController,
    totalSellCashController,
    totalSellCreditCardController,
    totalSellCreditDebitController,
    totalSellTransferController,
    updateMethodOfPaymentController
} from '../controllers/methodOfPaymentController.js'
import { checkJwt } from '../middleware/permission.js'

const router = Router()

router.put('/', [checkJwt], updateMethodOfPaymentController)
router.get('/', [checkJwt], findMethodOfPaymentByCompanyController)
router.get('/quantity', [checkJwt], quantitySellMethodOfPaymentController)
router.get('/totalSellCash', [checkJwt], totalSellCashController)
router.get('/totalSellTransfer', [checkJwt], totalSellTransferController)
router.get('/totalSellCreditCard', [checkJwt], totalSellCreditCardController)
router.get('/totalSellCreditDebit', [checkJwt], totalSellCreditDebitController)


export default router