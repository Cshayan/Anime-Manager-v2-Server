/* File to connect to MongoDB with mongoose */

const mongoose = require("mongoose");

const connectToDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  console.log("MongoDB connected successfully".cyan.underline.bold);
};

module.exports = connectToDB;
