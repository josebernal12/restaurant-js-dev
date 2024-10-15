import { Schema, model } from "mongoose";

const CompanySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: Number,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    currency: {
      type: String,
    },
  },
  { timestamps: true }
);

const companyModel = model("Company", CompanySchema);

export default companyModel;
