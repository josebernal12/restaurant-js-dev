import suscriptionModel from "../model/SuscriptionModel.js";
import userModel from "../model/UserModel.js";

const checkTrialPeriod = async (req, res, next) => {
  console.log(req.user._id)
  const user = await userModel
    .findById(req.user._id)
    .select("-password")
    .populate("suscription")
    .populate("rol");
  const suscription = await suscriptionModel.findOne({ userId: user._id });
  if (user?.rol?.name !== "admin") {
    const suscriptionCompany = await suscriptionModel.findOne({
      companyId: user.companyId,
    });
    if (suscriptionCompany.status) {
      return next();
    } else {
      return res
        .status(402)
        .json({ msg: "la suscripcion se ha agotado, favor de renovarla" });
    }
  }
  if (user?.rol?.name === "admin") {
    // Si el usuario tiene una suscripción activa, omitir la verificación de la prueba
    if (suscription) {
      if (new Date() > suscription.endDate) {
        user.trialBoolean = false;
        suscription.status = false;
        await user.save();
        await suscription.save();
        return res
          .status(402)
          .json({ msg: "la suscripcion se ha agotado, favor de renovarla" });
      }
      user.trialBoolean = true;
      suscription.status = true;
      await user.save();
      await suscription.save();
      return next();
    }

    // Si no tiene suscripción, verificar si la prueba ha expirado
    if (user?.trialEndsAt && new Date() > user?.trialEndsAt) {
      user.trialBoolean = false;
      await user.save();
      return res.status(402).json({
        msg: "los dias de prueba se han agotado, si quiere seguir usando la app favor de pagar la suscripcion",
      });
    }
  }
  user.trialBoolean = true;
  await user.save();
  next();
};

export default checkTrialPeriod;
