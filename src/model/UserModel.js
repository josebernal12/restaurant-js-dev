import mongoose from "mongoose";
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    havePassword: {
      type: Boolean,
      default: true,
    },
    rol: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rol",
    },
    token: {
      type: String,
      default: null,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    haveCompany: {
      type: Boolean,
      trim: true,
      default: false,
    },
    suscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "suscription",
      trim: true,
    },
    trialEndsAt: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // 3 días a partir de la fecha de creación
      },
    },
    trialBoolean: {
      type: Boolean,
      default: true,
    },
    mode: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);
export default userModel;
