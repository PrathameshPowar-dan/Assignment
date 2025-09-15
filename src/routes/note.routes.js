import express from "express";
import { createNote, getNotes, getNote, updateNote, deleteNote } from "../controllers/notes.controller.js";
import AuthToken from "../middlewares/auth.js";

const router = express.Router();
router.post("/", AuthToken, createNote);
router.get("/", AuthToken, getNotes);
router.get("/:id", AuthToken, getNote);
router.put("/:id", AuthToken, updateNote);
router.delete("/:id", AuthToken, deleteNote);

export default router;
