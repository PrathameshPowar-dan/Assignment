import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
import AuthRouter from "./routes/auth.routes.js"


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/user",AuthRouter);

export {app}