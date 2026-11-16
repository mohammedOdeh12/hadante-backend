import { AppDataSource } from "../../config/database";
import { SuperAdmin } from "../../entities/SuperAdmin";
import { comparePasswords, generateToken } from "../../utils/auth";
export const adminLoginService = async (email: string, password: string) => {
    const adminRepo = AppDataSource.getRepository(SuperAdmin);
    
    // 1. Find admin by email and load role relation using TypeORM 0.3 syntax
    const admin = await adminRepo.findOne({ 
        where: { email },
        relations: {
            role: true // Fixed syntax for TypeORM 0.3+
        }
    });

    if (!admin) {
        throw new Error("Invalid email or password");
    }

    if (!admin.is_active) {
        throw new Error("Account is disabled. Please contact management.");
    }

    // 2. Verify password
    const isPasswordValid = await comparePasswords(password, admin.password_hash);
    
    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    // 3. Generate JWT token (Includes ID, Role, and Identity Type)
    const token = generateToken({ 
        id: admin.id, 
        role_name: admin.role?.name,
        identity_type: "super_admin" 
    });

    return {
        admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role?.name
        },
        token
    };
};