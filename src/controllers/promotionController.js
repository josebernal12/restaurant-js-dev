import {
  createPromotion,
  deletePromotion,
  getAllPromotion,
  getPromotionById,
  updatePromotion,
} from "../services/promotion.js";

export const createPromotionController = async (req, res) => {
  const {
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
    priceBasis,
  } = req.body;
  const promotion = await createPromotion(
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
  );
  if (promotion?.msg) {
    return res.status(404).json(promotion);
  }
  res.json(promotion);
};

export const updatePromotionController = async (req, res) => {
  const {
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
  } = req.body;
  const { id } = req.params;
  const promotion = await updatePromotion(
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
  );
  if (promotion?.msg) {
    return res.status(404).json(promotion);
  }
  res.json(promotion);
};

export const deletePromotionController = async (req, res) => {
  const { id } = req.params;
  const promotion = await deletePromotion(id);
  if (promotion?.msg) {
    return res.status(404).json(promotion);
  }
  res.json(promotion);
};

export const getAllPromotionController = async (req, res) => {
  const promotion = await getAllPromotion(req.user.companyId.toString());
  if (promotion?.msg) {
    return res.status(404).json(promotion);
  }
  res.json(promotion);
};
export const getPromotionByIdController = async (req, res) => {
  const { id } = req.params;
  const promotion = await getPromotionById(id);
  if (promotion?.msg) {
    return res.status(404).json(promotion);
  }
  res.json(promotion);
};
