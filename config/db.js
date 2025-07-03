import mongoose from "mongoose";

const connectDB = async() =>{
    try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(conn.connection.host)    
    } catch (error) {
        console.error(`Error at db config : ${error.message}` )
    }
    
}

export default connectDB