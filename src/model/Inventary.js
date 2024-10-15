import mongoose from 'mongoose'

const { Schema } = mongoose

const inventarySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  max: {
    type: Number,
    required: true
  },
  min: {
    type: Number,
    required: true
  },
  unit: {
    name: {
      type: String,
      required: true
    },
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  unitQuantity: {
    type: Number
  },
  unitType: {
    type: String
  }
}, {
  timestamps: true
})

const inventaryModel = mongoose.model('Inventary', inventarySchema)

export default inventaryModel