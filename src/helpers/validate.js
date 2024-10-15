import userModel from "../model/UserModel.js";


export const checkEmailInDB = async (email) => {
  try {
    const existEmail = await userModel.findOne({ email }).populate('rol')
    if (!existEmail) {
      return null;
    }
    return existEmail;
  } catch (error) {
    console.log(error);
    throw new Error("Error al buscar el usuario por correo electrónico.");
  }
}