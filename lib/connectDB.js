import mongoose from "mongoose";

export const connectDB = async () => {
    console.log("Connecting To DB");
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected Successfully", db.connection.host);
    } catch (error) {
        console.log("DB not Connected Successfully", error);
    }
}