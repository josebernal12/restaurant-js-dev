import promotionModel from "../model/Promotion.js";

export const createPromotion = async (
  name,
  description,
  price,
  days,
  startHour,
  endHour,
  startDate,
  endDate,
  type,
  discount,
  active,
  image,
  productsId,
  companyId,
  dailyMenu,
  iva,
  priceBasis
) => {
  try {
    if (!name || !description || !type) {
      return {
        msg: "todos los campos son obligatorios",
      };
    }
    const promotion = await promotionModel.create({
      name,
      description,
      price,
      days,
      startHour,
      endHour,
      startDate,
      endDate,
      type,
      discount,
      active,
      image,
      productsId,
      companyId,
      dailyMenu,
      iva,
      priceBasis
    });
    if (!promotion) {
      return {
        msg: "error al crear la promocion",
      };
    }
    return promotion;
  } catch (error) {
    console.log(error);
  }
};

export const updatePromotion = async (
  id,
  name,
  description,
  price,
  days,
  startHour,
  endHour,
  startDate,
  endDate,
  type,
  discount,
  active,
  image,
  productsId,
  companyId,
  dailyMenu,
  iva,
  priceBasis
) => {
  try {
    const promotion = await promotionModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        days,
        startHour,
        endHour,
        startDate,
        endDate,
        type,
        discount,
        active,
        image,
        productsId,
        companyId,
        dailyMenu,
        iva,
        priceBasis
      },
      { new: true }
    );
    if (!promotion) {
      return {
        msg: "error al actualizar",
      };
    }
    return promotion;
  } catch (error) {
    console.log(error);
  }
};

export const deletePromotion = async (id) => {
  try {
    const promotion = await promotionModel.findByIdAndDelete(id, { new: true });
    if (!promotion) {
      return {
        msg: "no existe promocion con ese id",
      };
    }
    return promotion;
  } catch (error) {
    console.log(error);
  }
};

export const getAllPromotion = async (companyId) => {
  try {
    const promotions = await promotionModel.find({ companyId });
    if (!promotions) {
      return {
        promotions: [],
      };
    }
    return promotions;
  } catch (error) {
    console.log(error);
  }
};

export const getPromotionById = async (id) => {
  try {
    const promotion = await promotionModel.findById(id);
    if (!promotion) {
      return {
        msg: "no existe promocion con ese id",
      };
    }
    return promotion;
  } catch (error) {
    console.log(error);
  }
};
