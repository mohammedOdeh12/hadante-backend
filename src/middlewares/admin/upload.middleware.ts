import multer from "multer";
import fs from "fs";
import path from "path";

// تحديد مجلد الحفظ (سيتم إنشاؤه تلقائياً إذا لم يكن موجوداً)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "uploads/nurseries";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // تسمية الملف برقم فريد بناءً على الوقت لتجنب التكرار
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

// فلترة الملفات لقبول الصور فقط
const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("الملف المرفوع ليس صورة!"), false);
    }
};

export const uploadLogo = multer({ storage, fileFilter });