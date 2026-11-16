import { Request, Response } from "express";
import { AppDataSource } from "../../config/database";
import { User } from "../../entities/User";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export const userLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // 1. التحقق من إرسال البيانات الأساسية
        if (!email || !password) {
            res.status(400).json({ success: false, message: "Email and password are required" });
            return;
        }

        const userRepo = AppDataSource.getRepository(User);

        // 2. البحث عن الموظف وجلب علاقاته (الدور والحضانة)
        const user = await userRepo
            .createQueryBuilder("user")
            .addSelect("user.password") // جلب الباسورد المخفي للمقارنة
            .leftJoinAndSelect("user.nursery", "nursery") // جلب بيانات الحضانة
            .leftJoinAndSelect("user.role", "role") // جلب بيانات الدور
            .where("user.email = :email", { email })
            .getOne();

        // 3. التأكد من وجود الموظف
        if (!user) {
            res.status(401).json({ success: false, message: "Invalid email or password" });
            return;
        }

        // 4. التأكد من أن حساب الموظف نشط
        if (!user.is_active) {
            res.status(403).json({ success: false, message: "Account is inactive. Contact your nursery administrator." });
            return;
        }

        // 5. التأكد من أن الحضانة التابع لها نشطة أيضاً (مهم جداً!)
        if (user.nursery && !user.nursery.is_active) {
            res.status(403).json({ success: false, message: "Your nursery account is currently inactive." });
            return;
        }

        // 6. التحقق من كلمة المرور
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ success: false, message: "Invalid email or password" });
            return;
        }

        // 7. التأكد من أن الموظف يمتلك دور "Admin" (بناءً على طلبك)
        // إذا كان لديك أكثر من دور، يمكنك تعديل هذا الشرط أو حذفه والاعتماد على الـ Permissions لاحقاً
        if (!user.role || user.role.name !== "Admin") {
             res.status(403).json({ success: false, message: "Access denied. Admin role required." });
             return;
        }

        // 8. إنشاء الـ JWT Token
        const jwtSecret = process.env.JWT_SECRET || "default_secret_key";
        const tokenPayload = {
            userId: user.id,
            email: user.email,
            roleId: user.role?.id,
            roleName: user.role?.name,
            nurseryId: user.nursery?.id, // أهم حقل لتقييد وصول الموظف لبيانات حضانته فقط
            type: "NURSERY_STAFF" // للتمييز بينه وبين الـ SUPER_ADMIN
        };

        const token = jwt.sign(tokenPayload, jwtSecret, { expiresIn: "12h" });

        // 9. إرسال الرد بنجاح
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                nursery: {
                    id: user.nursery?.id,
                    name: user.nursery?.name
                },
                role: user.role?.name
            }
        });

    } catch (error: any) {
        console.error("Nursery Staff Login Error:", error);
        res.status(500).json({ success: false, message: "Internal server error during login" });
    }
};