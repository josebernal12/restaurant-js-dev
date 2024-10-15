import mongoose from "mongoose";
const { Schema } = mongoose;
import { uid } from "uid";
const ticketSchema = new Schema(
  {
    products: [
      {
        name: String,
        price: Number,
        stock: Number,
        discount: Number,
        iva: Number,
        priceBasis: Number,
        category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "category",
        },
        uid: {
          type: String,
          default: uid(16),
        },
        completed: {
          type: Boolean,
          default: false,
        },
        idProduct: {
          type: String,
          default: null,
        },
        recipe: [
          {
            name: String,
            stock: Number,
            unitType: Number,
            unitQuantity: Number,
            unit: String,
            // max: Number,
            // min: Number,
          },
        ],
      },
    ],
    subTotal: {
      type: Number,
      // required: true,
    },
    total: {
      type: Number,
      // required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "table",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    waiter: {
      type: String,
    },
    waiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
    },
    promotion: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "promotion",
        default: false,
      },
    ],
    folio: {
      type: Number,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    type: {
      type: String,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "client",
    },
  },
  {
    timestamps: true,
  }
);

const ticketModel = mongoose.model("ticket", ticketSchema);

export default ticketModel;
