import { Router } from 'express'
import {
    createCompanyController,
    findCompanyByIdController,
    updateCompanyController
} from '../controllers/companyController.js'
import { checkJwt } from '../middleware/permission.js'

const router = Router()

router.post('/',  createCompanyController)
router.put('/:id', [checkJwt], updateCompanyController)
router.get('/:id', [checkJwt], findCompanyByIdController)

export default router