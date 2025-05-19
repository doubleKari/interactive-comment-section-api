import mongoose from "mongoose";
import 'dotenv/config'



const MONGO_URI = process.env.MONGO_URI;

export const connectDB = async ()=> {
    try {
        const conn = await mongoose.connect(MONGO_URI)
        console.log(`MongoDB connect: ${conn.connection.host}`);
        
    }catch(error){
        console.log(`Error: ${error.message}`);
        process.exit(1);

    }
};