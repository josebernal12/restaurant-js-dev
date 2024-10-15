import mongoose, { Schema } from 'mongoose'


const targetsSchema = new Schema({
  targets: [
    {
      target: String,
      date: String
    }
  ],
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  }

},
  {
    timestamps: true
  })


const targetModel = mongoose.model('target', targetsSchema)

export default targetModel