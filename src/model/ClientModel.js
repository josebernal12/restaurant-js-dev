import mongoose from 'mongoose'

const { Schema } = mongoose

const clientSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  street: {
    type: String,
    default: null
  },
  colonia: {
    type: String,
    // required: true
  },
  ref: {
    type: String,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
     ref: 'Company'
   }

 }, {
   timestamps: true
})
 const clientModel = mongoose.model('client', clientSchema)
export default clientModel
