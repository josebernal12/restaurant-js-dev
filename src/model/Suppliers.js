import { Schema, model } from 'mongoose'

const suppliersSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    }
}, { timestamps: true })

const supplierModel = model('supplier', suppliersSchema)

export default supplierModel