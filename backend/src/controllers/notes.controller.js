import mongoose from "mongoose";
import Note from "../models/note.models.js";
import Tenant from "../models/tenant.models.js";
import { ApiError } from "../utilities/ApiError.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { AsyncHandler } from "../utilities/AsyncHandler.js";

export const createNote = AsyncHandler(async (req, res) => {
    const { title, content } = req.body;
    const { tenantId, userId } = req.user;

    if (!title) {
        throw new ApiError(400, "Title is required");
    }

    const tenant = await Tenant.findById(tenantId);
    if (!tenant) throw new ApiError(404, "Tenant not found");

    if (tenant.plan === "free") {
        const count = await Note.countDocuments({ tenantId });
        if (count >= 3) {
            throw new ApiError(403, "Upgrade to Pro to add more notes");
        }
    }

    const note = await Note.create({
        title,
        content: content || "",
        tenantId,
        userId,
    });

    return res.status(201).json(new ApiResponse(201, note, "Note created"));
});


export const getNotes = AsyncHandler(async (req, res) => {
    const { tenantId } = req.user;

    const notes = await Note.find({ tenantId }).sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, notes, "Notes fetched"));
});


export const getNote = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { tenantId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid note id");
    }

    const note = await Note.findById(id);
    if (!note) throw new ApiError(404, "Note not found");

    if (note.tenantId.toString() !== tenantId.toString()) {
        throw new ApiError(403, "Access denied");
    }

    return res.status(200).json(new ApiResponse(200, note, "Note fetched"));
});


export const updateNote = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const { tenantId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid note id");
    }

    const note = await Note.findById(id);
    if (!note) throw new ApiError(404, "Note not found");

    if (note.tenantId.toString() !== tenantId.toString()) {
        throw new ApiError(403, "Access denied");
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    note.updatedAt = new Date();

    await note.save();

    return res.status(200).json(new ApiResponse(200, note, "Note updated"));
});


export const deleteNote = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { tenantId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid note id");
    }

    const note = await Note.findById(id);
    if (!note) throw new ApiError(404, "Note not found");

    if (note.tenantId.toString() !== tenantId.toString()) {
        throw new ApiError(403, "Access denied");
    }

    await note.deleteOne();

    return res.status(200).json(new ApiResponse(200, null, "Note deleted"));
});
