import { Router } from 'express'
import {
  addProductController,
  bestProductController,
  deleteManyProductsController,
  deleteProductController,
  getProductByIdController,
  getProductsController,
  manyProductsController,
  searchProductController,
  updateProductController
} from '../controllers/productController.js'
import {
  addProductPermission,
  deleteProductPermission,
  updateProductPermission
} from '../middleware/productPermission.js'
import { checkJwt } from '../middleware/permission.js'

const router = Router()

router.get('/', [checkJwt], getProductsController)
router.post('/', [checkJwt], addProductController)
router.get('/bestSeller', [checkJwt], bestProductController)
router.put('/update/:id', updateProductController)
router.delete('/delete/:id', [checkJwt], deleteProductController)
router.post('/search', [checkJwt], searchProductController)
router.delete('/delete-manyProducts', [checkJwt], deleteManyProductsController)
router.post('/many-products', [checkJwt], manyProductsController)
router.get('/:id', [checkJwt], getProductByIdController)

export default router