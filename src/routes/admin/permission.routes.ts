import { Router } from "express";
import {
    createPermission, getPermissions, getPermissionById, updatePermission, deletePermission
} from "../../controllers/admin/permission.controller";
import { verifyToken } from "../../middlewares/admin/auth.middleware";

const router = Router();
router.use(verifyToken);
router.route("/").post(createPermission).get(getPermissions);
router.route("/:id").get(getPermissionById).put(updatePermission).delete(deletePermission);

export default router;