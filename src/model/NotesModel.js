import mongoose, { Schema } from 'mongoose'

const notesSchema = new Schema({
  note: [
    {
      message: String,
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    }
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ticket'
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  }
})

const noteModel = mongoose.model('note', notesSchema)

export default noteModel