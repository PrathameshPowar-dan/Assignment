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
        "https://*.vercel.app",
        "https://*-your-username.vercel.app"
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

app.use("/api/user", AuthRouter);
app.use("/api/note", NoteRouter);
app.use("/api/tenants", TenantRouter);


export { app }