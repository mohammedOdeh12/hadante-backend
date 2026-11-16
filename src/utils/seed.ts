import { AppDataSource } from "../config/database";
import { Role } from "../entities/Role";
import { SuperAdmin } from "../entities/SuperAdmin";
import { hashPassword } from "./auth";

export const seedInitialData = async () => {
    const roleRepo = AppDataSource.getRepository(Role);
    const adminRepo = AppDataSource.getRepository(SuperAdmin);

    // التحقق مما إذا كان دور المدير العام موجوداً
    let superAdminRole = await roleRepo.findOneBy({ name: "مدير عام" });
    
    if (!superAdminRole) {
        superAdminRole = roleRepo.create({ 
            name: "مدير عام", 
            description: "يمتلك كافة الصلاحيات لإدارة منصة هادانتي" 
        });
        await roleRepo.save(superAdminRole);
        console.log("✅ تم إنشاء دور: مدير عام");
    }

    // التحقق مما إذا كان حساب المشرف الأول موجوداً
    const existingAdmin = await adminRepo.findOneBy({ email: "admin@hadante.com" });
    
    if (!existingAdmin) {
        const hashedPassword = await hashPassword("admin123");
        const newAdmin = adminRepo.create({
            name: "المدير العام",
            email: "admin@hadante.com",
            password_hash: hashedPassword,
            role: superAdminRole
        });
        await adminRepo.save(newAdmin);
        console.log("✅ تم إنشاء حساب المشرف بنجاح (admin@hadante.com / admin123)");
    }
};