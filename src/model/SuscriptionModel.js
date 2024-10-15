import { Schema, model } from "mongoose";

const suscriptionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    suscriptionType: {
      type: String,
    },
  },
  { timestamps: true }
);

const suscriptionModel = model("suscription", suscriptionSchema);

export default suscriptionModel;
