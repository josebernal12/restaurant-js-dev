import { Schema, model } from "mongoose";

const currencySchema = new Schema(
  {
    conversionRates: {
      MXN: { type: Number, required: true },
      ARS: { type: Number, required: true },
      BOB: { type: Number, required: true },
      BRL: { type: Number, required: true },
      CLP: { type: Number, required: true },
      COP: { type: Number, required: true },
      CRC: { type: Number, required: true },
      CUP: { type: Number, required: true },
      PYG: { type: Number, required: true },
      USD: { type: Number, required: true },
      UYU: { type: Number, required: true },
      VES: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

const CurrencyModel = model("Currency", currencySchema);

export default CurrencyModel;
