import mongoose from "mongoose";

const { Schema } = mongoose;

const promotionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
    },
    days: [
      {
        type: String,
      },
    ],
    startHour: {
      type: String,
    },
    endHour: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    type: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      default: null,
    },
    active: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: null,
    },
    productsId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    dailyMenu: {
      type: String,
      trim: true,
    },
    iva: {
      type: Number,
    },
    priceBasis: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const promotionModel = mongoose.model("promotion", promotionSchema);

export default promotionModel;
