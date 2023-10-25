const mongoose = require('mongoose');

const db = async () => {
    const params = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };
      try {
        mongoose.set("strictQuery", true);
        mongoose.connect(process.env.MONGO_URL, params);
        console.log("MongoDB connected sucessfully");
      } catch (error) {
        console.log("MongoDB Connection Failed", error);
      }
}

module.exports = {db}