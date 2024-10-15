import { authGoogle, changePassword, checkTokenEmail, login, register, restorePassword } from '../services/auth.js'


export const registerController = async (req, res) => {
  const { name, lastName, email, password, confirmPassword, rol, companyId } = req.body
  const user = await register(name, lastName, email, password, confirmPassword, rol, companyId)
  if (user?.msg) {
    res.status(404).json(user)
    return
  }
  res.json({
    user
  })
}

export const loginController = async (req, res) => {
  const { email, password } = req.body
  const user = await login(email, password)
  if (user === "email o password no son correctos") {
    res.status(404).json(user)
    return
  }
  res.json(user)
}

export const restorePasswordController = async (req, res) => {
  const { email } = req.body
  const user = await restorePassword(email)
  if (user?.msg) {
    res.status(404).json(user)
    return
  }
  res.json(user.token)
}

export const checkTokenEmailController = async (req, res) => {
  const { token } = req.params
  const user = await checkTokenEmail(token)
  if (user?.msg) {
    res.status(404).json(user)
    return
  }
  res.json(user)
}

export const changePasswordController = async (req, res) => {
  const { token } = req.params
  const { password, passwordRepit } = req.body
  const user = await changePassword(password, passwordRepit, token)
  if (user?.msg) {
    res.status(404).json(user)
    return
  }
  res.json(user)
}

export const authGoogleController = async (req, res) => {
  const { user } = req.body
  const newUser = await authGoogle(user)
  if (newUser?.msg) {
    res.status(404).json(newUser)
    return
  }
  res.json(newUser)
}