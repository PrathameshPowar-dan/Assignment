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
            throw new ApiError(401, "Unauthorized access - No token provided");
        }

        const decoded = JWT.verify(token, process.env.JWT_SECRET_TOKEN);

        const user = await User.findById(decoded.userId)
            .populate("tenantId")
            .select("-password");
            
        if (!user) {
            throw new ApiError(401, "Invalid Access Token - User not found");
        }

        req.user = {
            userId: user._id,
            tenantId: user.tenantId._id,
            role: user.role,
            email: user.email,
        };

        next();
    } catch (err) {
        console.error("AuthToken error:", err.message);
        
        if (err.name === "JsonWebTokenError") {
            throw new ApiError(401, "Invalid token");
        } else if (err.name === "TokenExpiredError") {
            throw new ApiError(401, "Token expired");
        } else {
            throw new ApiError(401, "Invalid or expired token");
        }
    }
});

export default AuthToken;