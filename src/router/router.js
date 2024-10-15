import { Router } from 'express'

import { authGoogleController, changePasswordController, checkTokenEmailController, loginController, registerController, restorePasswordController } from '../controllers/authController.js'
import {
    createUserController,
    deleteManyUsersController,
    deleteUserController,
    getUserByIdController,
    getUsersController,
    logoutController,
    manyUsersController,
    obtainUserByToken,
    renewToken,
    tokenIsValidController,
    updateUserController,
    uploadExcelController,
    userSearchController,
    usersWithoutPasswordController
} from '../controllers/userController.js'
import { isAdmin } from '../middleware/isAdmin.js'
import { addUserPermission, checkJwt, deleteUserPermission, updateUserPermission } from '../middleware/permission.js'

const router = Router()


// router.post('/search', userSearchController)




export default router