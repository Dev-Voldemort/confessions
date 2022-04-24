import dotenv from "dotenv";
dotenv.config(); 
import mongoose from "mongoose";

try {
    await mongoose.connect(process.env.MONGODB_URI);
}
    catch(error) {
    console.log(error);
}

mongoose.connection.on("error", (err) => {
    console.log(err);
});
  
const confessionsSchema = new mongoose.Schema({
    name: String,
    time: String,
    user: String,
}, { versionKey: false});

const Confession = mongoose.model("Confession", confessionsSchema);

export { Confession };