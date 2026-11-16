import { Router } from "express";
import {
    createSuperAdmin,
    getSuperAdmins,
    getSuperAdminById,
    updateSuperAdmin,
    deleteSuperAdmin
} from "../../controllers/admin/superAdmin.controller";
import { verifyToken } from "../../middlewares/admin/auth.middleware";

const router = Router();

// Protect all routes
router.use(verifyToken);

// GET & POST - All Super Admins
router.route("/")
    .post(createSuperAdmin)
    .get(getSuperAdmins);

// GET, PUT & DELETE - Single Super Admin by ID
router.route("/:id")
    .get(getSuperAdminById)
    .put(updateSuperAdmin)
    .delete(deleteSuperAdmin);

export default router;