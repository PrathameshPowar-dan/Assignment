import mongoose from "mongoose";

const { Schema } = mongoose;

const tenantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },
  },
  { timestamps: true }
);

const Tenant = mongoose.models.Tenant || mongoose.model("Tenant", tenantSchema);

export default Tenant;
