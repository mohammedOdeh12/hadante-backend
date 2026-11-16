import { Router } from "express";
import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} from "../../controllers/admin/user.controller";
import { verifyToken } from "../../middlewares/admin/auth.middleware";

const router = Router();

// حماية جميع المسارات الخاصة بالمستخدمين
router.use(verifyToken);

// المسار: /api/admin/users
router.route("/")
    .post(createUser)
    .get(getUsers);

// المسار مع الـ ID: /api/admin/users/:id
router.route("/:id")
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

export default router;