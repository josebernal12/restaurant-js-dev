import suscriptionModel from "../model/SuscriptionModel.js";
import userModel from "../model/UserModel.js";

export const paySuscription = async (type, userId) => {
  try {
    const startDate = new Date();
    let endDate;

    if (type === "month") {
      endDate = new Date(startDate.setMonth(startDate.getMonth() + 1)); // Suma 1 mes
    } else if (type === "year") {
      endDate = new Date(startDate.setFullYear(startDate.getFullYear() + 1)); // Suma 1 año
    } else {
      throw new Error("Tipo de suscripción no válido");
    }
    const userSuscription = await suscriptionModel
      .findOne({ userId })
      .populate({
        path: "userId",
        select: "-password",
      });
    const userById = await userModel.findById(userId).populate("rol");
    if (userById.rol.name !== "admin") {
      return {
        msg: "solamente las cuentas admin pueden comprar suscripciones.",
      };
    }
    if (userSuscription) {
      userSuscription.startDate = new Date();
      userSuscription.endDate = endDate;
      userSuscription.suscriptionType = type;
      userSuscription.companyId = userById.companyId;
      userSuscription.status = true;
      await userSuscription.save();
      await userById.save();
      return userSuscription;
    }
    const suscription = await suscriptionModel.create({
      userId,
      companyId: userById.companyId,
      startDate: new Date(),
      endDate,
      status: true, // Se activa la suscripción
      suscriptionType: type,
    });
    userById.suscription = suscription._id;
    userById.trialBoolean = true;
    await userById.save();
    const user = await suscriptionModel.findById(suscription._id).populate({
      path: "userId",
      select: "-password",
    });
    return user;
  } catch (error) {
    console.log(error);
    throw new Error("Error al procesar la suscripción");
  }
};

export const getSuscriptionById = async (id) => {
  try {
    const suscription = await suscriptionModel.findById(id).populate("userId");
    if (!suscription) {
      return {
        msg: "error getting user by id",
      };
    }
    return suscription;
  } catch (error) {
    console.log(error);
  }
};
