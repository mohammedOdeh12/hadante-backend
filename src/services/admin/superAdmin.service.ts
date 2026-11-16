import { AppDataSource } from "../../config/database";
import { SuperAdmin } from "../../entities/SuperAdmin";
import { Role } from "../../entities/Role";
import bcrypt from "bcrypt";

export const createSuperAdminService = async (data: any) => {
    const adminRepo = AppDataSource.getRepository(SuperAdmin);
    const roleRepo = AppDataSource.getRepository(Role);

    const existingAdmin = await adminRepo.findOne({ where: { email: data.email } });
    if (existingAdmin) {
        throw new Error("Email already exists");
    }

    let role = null;
    if (data.role_id) {
        role = await roleRepo.findOne({ where: { id: data.role_id } });
        if (!role) {
            throw new Error("Role not found");
        }
    }

    const password_hash = await bcrypt.hash(data.password, 10);

    const newAdmin = adminRepo.create({
        name: data.name,
        email: data.email,
        password_hash,
        role: role || undefined,
        is_active: data.is_active !== undefined ? data.is_active : true
    });

    return await adminRepo.save(newAdmin);
};

export const getSuperAdminsService = async () => {
    const adminRepo = AppDataSource.getRepository(SuperAdmin);
    return await adminRepo.find({ 
        relations: { role: true }, 
        order: { created_at: "DESC" } 
    });
};

export const getSuperAdminByIdService = async (id: number) => {
    const adminRepo = AppDataSource.getRepository(SuperAdmin);
    const admin = await adminRepo.findOne({ 
        where: { id }, 
        relations: { role: true } 
    });
    
    if (!admin) throw new Error("Super Admin not found");
    return admin;
};

export const updateSuperAdminService = async (id: number, data: any) => {
    const adminRepo = AppDataSource.getRepository(SuperAdmin);
    const roleRepo = AppDataSource.getRepository(Role);

    const admin = await adminRepo.findOne({ where: { id } });
    if (!admin) throw new Error("Super Admin not found");

    if (data.email && data.email !== admin.email) {
        const existingAdmin = await adminRepo.findOne({ where: { email: data.email } });
        if (existingAdmin) throw new Error("Email already exists");
        admin.email = data.email;
    }

    if (data.name) admin.name = data.name;
    if (data.is_active !== undefined) admin.is_active = data.is_active;

    if (data.password) {
        admin.password_hash = await bcrypt.hash(data.password, 10);
    }

    if (data.role_id) {
        const role = await roleRepo.findOne({ where: { id: data.role_id } });
        if (!role) throw new Error("Role not found");
        admin.role = role;
    }

    return await adminRepo.save(admin);
};

export const deleteSuperAdminService = async (id: number) => {
    const adminRepo = AppDataSource.getRepository(SuperAdmin);
    const admin = await adminRepo.findOne({ where: { id } });
    
    if (!admin) throw new Error("Super Admin not found");
    
    await adminRepo.remove(admin);
    return true;
};