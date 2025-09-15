import { app } from "./app.js";
import mongoose from "mongoose";
import { DB_NAME } from "./constant.js";
import { config } from "dotenv";

config();

const DataBaseConnection = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log('MongoDB Connected');
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
}

DataBaseConnection().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is active on port: ${process.env.PORT}`)
    })
})
    .catch((error) => {
        console.log(`Error while connecting server: ${error}`)
    })

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
