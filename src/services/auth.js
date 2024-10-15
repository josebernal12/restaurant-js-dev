import generateToken from "../helpers/generateToken.js";
import { checkEmailInDB } from "../helpers/validate.js";
import userModel from "../model/UserModel.js";
import RolModel from "../model/RolModel.js";
import bcrypt from "bcrypt";
import { uid } from "uid";
import suscriptionModel from "../model/SuscriptionModel.js";
export const register = async (
  name,
  lastName,
  email,
  password,
  confirmPassword,
  rol,
  companyId
) => {
  const saltRounds = 10;
  const trialEnds = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
  try {
    const user = await checkEmailInDB(email);
    if (!user) {
      if (confirmPassword !== password) {
        return {
          msg: "Los passwords no coinciden",
        };
      } else {
        const saltRound = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, saltRound);
        if (!rol) {
          const newUser = await userModel.create({
            name,
            lastName,
            email,
            password: hash,
            companyId,
          });
          const suscription = await suscriptionModel.create({
            companyId,
            userId: newUser._id,
            status: true,
            suscriptionType: "fifteen days",
            startDate: new Date(),
            endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          });
          const [admin, miembro] = await Promise.all([
            RolModel.create({
              name: "admin",
              permissions: {
                mesa: {
                  crear: true,
                  eliminar: true,
                },
                ticket: {
                  pagar: true,
                  descargar: true,
                  imprimir: true,
                },
                meta: {
                  crear: true,
                },
                order: {
                  cancelar: true,
                  crear: true,
                },
              },
              userId: newUser._id,
            }),
            RolModel.create({
              name: "miembro",
              permissions: {
                mesa: {
                  crear: true,
                  eliminar: true,
                },
                ticket: {
                  pagar: true,
                  descargar: true,
                  imprimir: true,
                },
                meta: {
                  crear: true,
                },
                order: {
                  cancelar: true,
                  crear: true,
                },
              },
              userId: newUser._id,
            }),
          ]);
          newUser.rol = admin._id;
          newUser.suscription = suscription._id;
          await newUser.save();
          const populatedUser = await userModel
            .findById(newUser._id)
            .populate("rol")
            .select("-password");
          const token = generateToken(newUser.id);
          return {
            user: populatedUser,
            token,
          };
        }
        const newUser = await userModel.create({
          name,
          lastName,
          email,
          password: hash,
          rol,
          companyId,
        });
        const suscription = await suscriptionModel.create({
          companyId,
          userId: newUser._id,
          status: true,
          suscriptionType: "fifteen days",
          startDate: new Date(),
          endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        });
        newUser.suscription = suscription._id;
        await newUser.save();
        await Promise.all([
          RolModel.create({
            name: "admin",
            permissions: {
              mesa: {
                crear: true,
                eliminar: true,
              },
              ticket: {
                pagar: true,
                descargar: true,
                imprimir: true,
              },
              meta: {
                crear: true,
              },
              order: {
                cancelar: true,
                crear: true,
              },
            },
            userId: newUser._id,
          }),
          RolModel.create({
            name: "miembro",
            permissions: {
              mesa: {
                crear: true,
                eliminar: true,
              },
              ticket: {
                pagar: true,
                descargar: true,
                imprimir: true,
              },
              meta: {
                crear: true,
              },
              order: {
                cancelar: true,
                crear: true,
              },
            },
            userId: newUser._id,
          }),
        ]);
        const userId = await userModel
          .findById(newUser._id)
          .populate("rol")
          .select("-password");
        const token = generateToken(userId.id);
        return {
          user: userId,
          token,
        };
      }
    } else {
      return {
        msg: "el email ya existe",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const login = async (email, password) => {
  try {
    const user = await userModel.findOne({ email }).populate("rol");

    if (!user) {
      return "email o password no son correctos";
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      // Crear un nuevo objeto user sin la contraseña
      const userWithoutPassword = {
        ...user.toObject(), // Convertir el objeto Mongoose a un objeto plano
        password: undefined, // Opcionalmente puedes utilizar null o eliminar esta línea si prefieres no incluir el campo
      };

      const token = generateToken(user._id); // Supongo que el ID del usuario es user._id
      const userLogin = { user: userWithoutPassword, token }; // Construir el objeto userLogin
      return userLogin;
    } else {
      return "email o password no son correctos";
    }
  } catch (error) {
    console.log(error);
  }
};

//TODO CHECK
export const restorePassword = async (email) => {
  try {
    const exist = await userModel.findOne({ email }).populate("rol");
    if (!exist) {
      return {
        msg: "el email no existe en la DB",
      };
    }
    exist.token = uid(16);
    exist.save();
    return exist;
  } catch (error) {
    console.log(error);
  }
};

export const checkTokenEmail = async (token) => {
  try {
    const user = await userModel.findOne({ token });
    if (!user) {
      return {
        msg: "token no valido",
      };
    }
    return user;
  } catch (error) {
    console.log(error);
  }
};

export const changePassword = async (password, passwordRepit, token) => {
  try {
    const saltRounds = 10;
    if (password !== passwordRepit) {
      return {
        msg: "los password no son iguales",
      };
    }
    const user = await userModel.findOne({ token });
    if (!user) {
      return {
        msg: "el token no es valido",
      };
    }
    const saltRound = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, saltRound);
    user.password = hash;
    user.token = null;
    user.havePassword = true;
    user.save();
    return user;
  } catch (error) {
    console.log(error);
  }
};

export const authGoogle = async (user) => {
  try {
    if (!user.rol) {
      const rolMember = await RolModel.findOne({ name: "miembro" });
      const newUser = await (
        await userModel.create({
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          rol: rolMember._id,
        })
      ).populate("rol");
      const token = generateToken(newUser.id);

      return {
        user: newUser,
        token,
      };
    }
    const newUser = await userModel.create(user);
    if (!newUser) {
      return {
        msg: "error al crear el usuario",
      };
    }
    const token = generateToken(newUser.id);

    return { user: newUser, token };
  } catch (error) {
    console.log(error);
  }
};
