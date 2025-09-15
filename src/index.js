import { app } from "./app.js";
import mongoose from "mongoose";
import { DB_NAME } from "./constant.js";
import { config } from "dotenv";

config();

let isDBConnected = false;

// Ensure Mongo connects only once (important for serverless)
async function connectDB() {
  if (!isDBConnected) {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    console.log("MongoDB Connected");
    isDBConnected = true;
  }
}

// Health route (works both locally & on Vercel)
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Vercel entrypoint
export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res); // delegate requests to Express
  } catch (error) {
    console.error("Error in handler:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// For local dev: run `node index.js`
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}
