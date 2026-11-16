import { Router } from "express";
import {
    createNursery,
    getNurseries,
    getNurseryById,
    updateNursery,
    deleteNursery
} from "../../controllers/admin/nursery.controller";
import { verifyToken } from "../../middlewares/admin/auth.middleware";

const router = Router();

// حماية جميع المسارات الخاصة بالحضانات (يجب أن يكون المشرف مسجلاً للدخول)
router.use(verifyToken);

// المسار: /api/admin/nurseries
router.route("/")
    .post(createNursery) // تم إزالة uploadLogo 
    .get(getNurseries);

// المسار مع الـ ID
router.route("/:id")
    .get(getNurseryById)
    .put(updateNursery) // تم إزالة uploadLogo 
    .delete(deleteNursery);

export default router;