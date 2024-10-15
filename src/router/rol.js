import { Router } from 'express'
import { 
    createRolController, 
    deleteRolController, 
    getRolController, 
    updateRolController 
} from '../controllers/rolController.js'
import { isAdmin } from '../middleware/isAdmin.js'
import { checkJwt } from '../middleware/permission.js'
const router = Router()


router.post('/',[checkJwt],createRolController)
router.get('/', [checkJwt], getRolController)
router.put('/update/:id', [checkJwt], updateRolController)
router.delete('/delete/:id', [checkJwt], deleteRolController)
export default router