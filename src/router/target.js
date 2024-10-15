import { Router } from 'express'
import {
  createTargetController,
  deleteTargetController,
  getAllTargetController,
  getTargetbyIdController,
  updateTargetController
} from '../controllers/targetController.js'
import { checkJwt } from '../middleware/permission.js'

const router = Router()

router.get('/', [checkJwt], getAllTargetController)
router.post('/', [checkJwt], createTargetController)
router.get('/:id', [checkJwt], getTargetbyIdController)
router.put('/update/:id', [checkJwt], updateTargetController)
router.delete('/delete/:id', [checkJwt], deleteTargetController)


export default router