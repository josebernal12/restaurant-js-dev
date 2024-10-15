import { Router } from 'express'
import {
    createMultipleSuppliersController,
    createSupplierController,
    deleteMultipleSuppliersController,
    deleteSupplierController,
    getSupplierByIdController,
    getSuppliersController,
    updateSupplierController
} from '../controllers/supplierController.js'
import { checkJwt } from '../middleware/permission.js'


const router = Router()

router.post('/', [checkJwt], createSupplierController)
router.get('/', [checkJwt], getSuppliersController)
router.post('/createMultiple', [checkJwt], createMultipleSuppliersController)
router.delete('/deleteMultiple', [checkJwt], deleteMultipleSuppliersController)
router.put('/:id', [checkJwt], updateSupplierController)
router.delete('/:id', [checkJwt], deleteSupplierController)
router.get('/:id', [checkJwt], getSupplierByIdController)

export default router