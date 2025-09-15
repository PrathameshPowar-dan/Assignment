import { AsyncHandler } from "../utilities/AsyncHandler.js";
import { ApiError } from "../utilities/ApiError.js";
import AuthToken from "./auth.js";

export const adminOnly = AsyncHandler(async (req, _, next) => {
    if (!req.user) {
        throw new ApiError(401, "Unauthorized");
    }

    if (req.user.role !== "admin") {
        throw new ApiError(403, "Admin access required");
    }

    next();
});
