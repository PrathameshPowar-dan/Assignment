import { app } from "./app.js";
import mongoose from "mongoose";
import { DB_NAME } from "./constant.js";

let isDBConnected = false;

const DataBaseConnection = async () => {
    try {
        if (!process.env.MONGODB_URL) {
            console.error("MONGODB_URL environment variable is not set");
            return false;
        }
        
        const connectionString = `${process.env.MONGODB_URL}/${DB_NAME}`;
        console.log("Connecting to MongoDB...");
        
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('MongoDB Connected successfully');
        return true;
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        return false;
    }
}

// Health check endpoint
app.get("/health", (req, res) => {
    try {
        const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
        
        res.json({ 
            status: "ok", 
            database: dbStatus,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Health check error:", error);
        res.status(500).json({ 
            status: "error", 
            message: "Health check failed" 
        });
    }
});

app.get("/", (req, res) => {
    try {
        res.json({ 
            status: "HELLO WORLD", 
            message: "Backend is running!",
            database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
        });
    } catch (error) {
        console.error("Root endpoint error:", error);
        res.status(500).json({ 
            status: "error", 
            message: "Internal server error" 
        });
    }
});

// Initialize database connection on startup
DataBaseConnection().then(connected => {
    isDBConnected = connected;
    console.log("Database connection initialized:", connected);
}).catch(error => {
    console.error("Database initialization error:", error);
});

// Vercel serverless function handler
export default async function handler(req, res) {
    try {
        console.log(`Incoming request: ${req.method} ${req.url}`);
        
        // Try to reconnect if database is disconnected
        if (mongoose.connection.readyState !== 1) {
            console.log("Database not connected, attempting reconnect...");
            isDBConnected = await DataBaseConnection();
        }
        
        return app(req, res);
    } catch (error) {
        console.error("Serverless function error:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});