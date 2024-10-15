import categoryModel from "../model/CategoryModel.js";
import companyModel from "../model/CompanyModel.js";
import methodOfPaymentModel from "../model/methodOfPayment.js";
import RolModel from "../model/RolModel.js";
import suscriptionModel from "../model/SuscriptionModel.js";
import tableModel from "../model/TableModel.js";
import userModel from "../model/UserModel.js";
export const createCompany = async (
  name,
  email,
  address,
  phone,
  country,
  currency,
  userId
) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return { msg: "user id no existing" };
    }

    const company = await companyModel.create({
      name,
      email,
      address,
      phone,
      country,
      currency,
    });
    if (!company) {
      return { msg: "error creating company" };
    }

    user.haveCompany = true;
    user.companyId = company._id;
    const suscripcion = await suscriptionModel.findById(user.suscription);
    await categoryModel.create({
      name: "Principal",
      color: "#a84d4d",
      idFather: "",
      path: "Comida",
      companyId: user.companyId,
    });
    const rol = await RolModel.find({ userId: user._id });
    await tableModel.create({
      available: true,
      companyId: user.companyId,
      number: 1,
    });
    // Guardar el usuario antes de proceder con otros guardados
    await user.save();
    suscripcion.companyId = user.companyId;
    await suscripcion.save();
    await methodOfPaymentModel.create({ companyId: company._id });

    // Guardar cada rol en serie en lugar de en paralelo
    for (const value of rol) {
      value.companyId = company._id;
      await value.save();
    }

    return company;
  } catch (error) {
    console.log(error);
  }
};

export const updateCompany = async (
  id,
  name,
  email,
  address,
  phone,
  country,
  currency,
  companyId,
  userId
) => {
  try {
    const company = await companyModel.findByIdAndUpdate(
      id,
      { name, email, address, phone, country, companyId, userId, currency },
      { new: true }
    );
    if (!company) {
      return {
        msg: "error updating company",
      };
    }
    return company;
  } catch (error) {
    console.log(error);
  }
};

export const findCompanyById = async (id) => {
  try {
    const company = await companyModel.findById(id);
    if (!company) {
      return {
        msg: "error getting company",
      };
    }
    return company;
  } catch (error) {
    console.log(error);
  }
};
