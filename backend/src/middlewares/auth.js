import User from "../models/user.models.js";
import { ApiError } from "../utilities/ApiError.js";
import { AsyncHandler } from "../utilities/AsyncHandler.js";
import JWT from "jsonwebtoken";

const AuthToken = AsyncHandler(async (req, _, next) => {
    try {
        let token;

        if (req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token && req.cookies?.Token) {
            token = req.cookies.Token;
        }

        if (!token) {
            throw new ApiError(401, "Unauthorized access");
        }

        const decoded = JWT.verify(token, process.env.JWT_SECRET_TOKEN);

        req.user = {
            userId: decoded.userId,
            tenantId: decoded.tenantId,
            role: decoded.role,
        };

        const user = await User.findById(decoded.userId).select("-passwordHash");
        if (!user) throw new ApiError(401, "Invalid Access Token");

        req.user = {
            userId: user._id,
            tenantId: user.tenantId,
            role: user.role,
            email: user.email,
        };

        next();
    } catch (err) {
        throw new ApiError(401, "Invalid or expired token");
    }
});

export default AuthToken;
