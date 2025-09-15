import { app } from "./app.js";
import mongoose from "mongoose";
import { DB_NAME } from "./constant.js";

const DataBaseConnection = async () => {
    try {
        const connectionString = process.env.MONGODB_URL 
            ? `${process.env.MONGODB_URL}/${DB_NAME}`
            : `mongodb://localhost:27017/${DB_NAME}`;
            
        await mongoose.connect(connectionString);
        console.log('MongoDB Connected');
        return true;
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        return false;
    }
}

let isDBConnected = false;
DataBaseConnection().then(connected => {
    isDBConnected = connected;
});

app.get("/health", (req, res) => {
    res.json({ 
        status: "ok", 
        database: isDBConnected ? "connected" : "disconnected",
        timestamp: new Date().toISOString()
    });
});

app.get("/", (req, res) => {
    res.json({ status: "HELLO WORLD", message: "Backend is running!" });
});

export default async function handler(req, res) {

    if (!isDBConnected && mongoose.connection.readyState === 0) {
        isDBConnected = await DataBaseConnection();
    }
    
    return app(req, res);
}

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error'
    });
});