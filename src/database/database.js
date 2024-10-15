import mongoose from 'mongoose'
mongoose.set('strictQuery', false); 
export const connectDB = async () => {
   mongoose.connect(process.env.MONGO_URI)
}
