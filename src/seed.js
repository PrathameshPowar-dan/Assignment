import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import User from "./models/user.models.js";
import Tenant from "./models/tenant.models.js";
import Note from "./models/note.models.js";
import { DB_NAME } from "./constant.js";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    console.log("MongoDB connected for seeding");

    await User.deleteMany({});
    await Tenant.deleteMany({});
    await Note.deleteMany({});


    const acmeTenant = await Tenant.create({
      name: "Acme Inc",
      slug: "acme",
      plan: "free",
    });

    const globexTenant = await Tenant.create({
      name: "Globex Corp",
      slug: "globex",
      plan: "free",
    });

    const hashedPassword = await bcrypt.hash("password", 10);

    const users = [
      {
        email: "admin@acme.test",
        password: hashedPassword,
        role: "admin",
        tenantId: acmeTenant._id,
      },
      {
        email: "user@acme.test",
        password: hashedPassword,
        role: "member",
        tenantId: acmeTenant._id,
      },
      {
        email: "admin@globex.test",
        password: hashedPassword,
        role: "admin",
        tenantId: globexTenant._id,
      },
      {
        email: "user@globex.test",
        password: hashedPassword,
        role: "member",
        tenantId: globexTenant._id,
      },
    ];

    await User.insertMany(users);

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seed();
