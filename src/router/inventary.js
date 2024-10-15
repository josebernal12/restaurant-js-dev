import { Router } from 'express'
import {
  createProductInventoryController,
  deleteManyInventaryController,
  deleteProductInventoryController,
  getProducInventoryByIdController,
  inventaryController,
  manyInventaryController,
  updateProductInventoryController
} from '../controllers/inventaryController.js'
import { checkJwt } from '../middleware/permission.js'

const router = Router()


router.get('/', [checkJwt], inventaryController)
router.post('/', [checkJwt], createProductInventoryController)
router.put('/update/:id', [checkJwt], updateProductInventoryController)
router.delete('/delete/:id', [checkJwt], deleteProductInventoryController)
router.delete('/delete-manyInventary', [checkJwt], deleteManyInventaryController)
router.post('/inventaries', [checkJwt], manyInventaryController)
router.get('/:id', [checkJwt], getProducInventoryByIdController)


export default router