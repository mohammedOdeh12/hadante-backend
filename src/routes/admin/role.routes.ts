import { Router } from "express";
import { 
    createRole, 
    getRoles, 
    getRoleById, 
    updateRole, 
    deleteRole 
} from "../../controllers/admin/role.controller";
import { verifyToken } from "../../middlewares/admin/auth.middleware";

const router = Router();

// Protect all routes
router.use(verifyToken);

// GET & POST - All Roles
router.route("/")
    .post(createRole)
    .get(getRoles);

// GET, PUT & DELETE - Single Role by ID
router.route("/:id")
    .get(getRoleById)
    .put(updateRole)
    .delete(deleteRole);

export default router;