import { Router } from "express";
import { userLogin } from "../../controllers/admin/userAuth.controller";

const router = Router();

// مسار تسجيل الدخول (لا يحتاج إلى حماية verifyToken لأنه الـ Entry Point)
router.post("/login", userLogin);

export default router;