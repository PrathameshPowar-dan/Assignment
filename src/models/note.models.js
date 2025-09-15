import mongoose from "mongoose";
const { Schema } = mongoose;

const noteSchema = new Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, default: "" },
  tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);
export default Note;
