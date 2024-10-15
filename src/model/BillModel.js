import mongoose from "mongoose";

const { Schema } = mongoose;

const billSchema = new Schema(
  {
    ticketId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ticket",
      },
    ],
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "table",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    methodOfPayment: [
      {
        name: {
          type: String,
          trim: true,
        },
        sell: {
          type: Number,
        },
      },
    ],
    folio: {
      type: Number,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    tips: {
      type: Number,
    },
    iva: {
      type: Number,
    },
    type: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const billModel = mongoose.model("bill", billSchema);
export default billModel;
