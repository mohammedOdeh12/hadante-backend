import { Router } from "express";
import {
    createMedia, getMedia, getMediaById, deleteMedia
} from "../../controllers/admin/media.controller";
import { verifyToken } from "../../middlewares/admin/auth.middleware";
import { uploadLogo } from "../../middlewares/admin/upload.middleware"; // استيراد رفع الملفات

const router = Router();
router.use(verifyToken);

// أضفنا ميدل وير الرفع هنا، وسنسمي الحقل "file"
router.route("/")
    .post(uploadLogo.single("file"), createMedia)
    .get(getMedia);

router.route("/:id")
    .get(getMediaById)
    .delete(deleteMedia);

export default router;