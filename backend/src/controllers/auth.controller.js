import User from "../models/user.models.js";
import Tenant from "../models/tenant.models.js"; 
import { ApiError } from "../utilities/ApiError.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { AsyncHandler } from "../utilities/AsyncHandler.js";

const Options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
}

export const login = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email }).populate("tenantId");
    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const token = user.generateToken();
    const LoggedInUser = {
        id: user._id,
        email: user.email,
        role: user.role,
        tenant: {
            id: user.tenantId._id,
            slug: user.tenantId.slug,
            name: user.tenantId.name,
            plan: user.tenantId.plan,
        },
    }

    return res.status(200).cookie("Token", token, Options).json(new ApiResponse(200, LoggedInUser, "LOGGED IN SUCCESSFULLY"));
});