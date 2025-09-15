import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import AuthRouter from "./routes/auth.routes.js";
import NoteRouter from "./routes/note.routes.js";
import TenantRouter from "./routes/tenant.routes.js";

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://assignment-frontend-ten-chi.vercel.app",
        "https://*.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    exposedHeaders: ["set-cookie"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// API routes
app.use("/api/user", AuthRouter);
app.use("/api/note", NoteRouter);
app.use("/api/tenants", TenantRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/*", (req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
});

export { app };