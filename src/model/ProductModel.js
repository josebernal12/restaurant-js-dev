import mongoose, { mongo } from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema(
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
      type: Number,
      // required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    discount: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
    },
    // promotion: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'promotion',
    //   default: false,
    // },
    iva: {
      type: Number,
    },

    recipe: [
      {
        name: String,
        stock: Number,
        unit: String,
      },
    ],
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    priceBasis: {
      type: Number,
    },
    show: {
      type: Boolean,
    },
    currency: {
      type: String,
    },
  },
  {
    timestamps: true,
    autoIndex: false,
  }
);

const productModel = mongoose.model("Product", productSchema);

export default productModel;
