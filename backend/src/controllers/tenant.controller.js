import Tenant from "../models/tenant.models.js";
import { ApiError } from "../utilities/ApiError.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { AsyncHandler } from "../utilities/AsyncHandler.js";


export const upgradeTenant = AsyncHandler(async (req, res) => {
    const { slug } = req.params;
    const { tenantId: userTenantId, role } = req.user;

    const tenant = await Tenant.findOne({ slug });
    if (!tenant) throw new ApiError(404, "Tenant not found");

    if (tenant._id.toString() !== userTenantId.toString()) {
        throw new ApiError(403, "Access denied");
    }

    tenant.plan = "pro";
    await tenant.save();

    return res
        .status(200)
        .json(new ApiResponse(200, { slug: tenant.slug, plan: tenant.plan }, "Tenant upgraded to pro"));
});