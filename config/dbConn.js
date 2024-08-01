import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useUnifiedTopology: true,
      useNewURlParser: true,
    });
  } catch (error) {
    console.error(error);
  }
};

export default connectDB;
