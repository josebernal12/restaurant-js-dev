import { Schema, model } from 'mongoose'

const methodOfPaymentSchema = new Schema({
    cash: {
        type: Boolean,
        trim: true,
        default: true
    },
    transfer: {
        type: Boolean,
        trim: true,
        default: false
    },
    creditCard: {
        type: Boolean,
        trim: true,
        default:false
    },
    creditDebit: {
        type: Boolean,
        trim: true,
        default: false
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    }
})

const methodOfPaymentModel = model('methodOfPayment', methodOfPaymentSchema)

export default methodOfPaymentModel
