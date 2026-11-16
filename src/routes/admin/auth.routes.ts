import { Router } from "express";
import { loginAdmin } from "../../controllers/admin/auth.controller";

const router = Router();

// Admin login route: POST /api/auth/admin/login
router.post("/admin/login", loginAdmin);

export default router;