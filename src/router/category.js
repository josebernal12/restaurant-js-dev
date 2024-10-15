import { Router } from 'express'
import { checkJwt } from '../middleware/permission.js'
import {
    createCategoryController,
    deleteCategoryController,
    getAllCategoryController,
    getCategoryByIdController,
    updateCategoryController
} from '../controllers/categoryController.js'

const router = Router()

router.get('/', [checkJwt], getAllCategoryController)
router.post('/',    createCategoryController)
router.put('/update/:id', [checkJwt], updateCategoryController)
router.delete('/delete/:id', [checkJwt], deleteCategoryController)
router.get('/:id', [checkJwt], getCategoryByIdController)


export default router