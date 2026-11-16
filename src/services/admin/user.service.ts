import { AppDataSource } from "../../config/database";
import { User } from "../../entities/User";
import { Nursery } from "../../entities/Nursery";
import { Role } from "../../entities/Role";
import * as bcrypt from "bcrypt";

export interface UserDTO {
    name?: string;
    email?: string;
    password?: string;
    is_active?: boolean;
    nursery_id?: number;
    role_id?: number | null;
}

export const createUserService = async (data: UserDTO) => {
    const userRepo = AppDataSource.getRepository(User);
    const nurseryRepo = AppDataSource.getRepository(Nursery);
    const roleRepo = AppDataSource.getRepository(Role);

    if (!data.name || !data.email || !data.nursery_id) {
        throw new Error("Name, email, and nursery_id are required");
    }

    const nursery = await nurseryRepo.findOne({ where: { id: data.nursery_id } });
    if (!nursery) throw new Error("Nursery not found");

    const existingUser = await userRepo.findOne({ where: { email: data.email } });
    if (existingUser) throw new Error("User email already exists");

    let role: Role | undefined = undefined;
    if (data.role_id) {
        const foundRole = await roleRepo.findOne({ where: { id: data.role_id } });
        if (!foundRole) throw new Error("Role not found");
        role = foundRole;
    }

    const plainPassword = data.password || "123456";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const newUser = userRepo.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        is_active: data.is_active !== undefined ? data.is_active : true,
        nursery: nursery,
        role: role
    });

    const savedUser = await userRepo.save(newUser);
    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
};

export const getUsersService = async () => {
    const userRepo = AppDataSource.getRepository(User);
    return await userRepo.find({
        order: { created_at: "DESC" },
        relations: { nursery: true, role: true }
    });
};

export const getUserByIdService = async (id: number) => {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
        where: { id },
        relations: { nursery: true, role: true }
    });

    if (!user) throw new Error("User not found");
    return user;
};

export const updateUserService = async (id: number, data: UserDTO) => {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id } });

    if (!user) throw new Error("User not found");

    if (data.email && data.email !== user.email) {
        const existingUser = await userRepo.findOne({ where: { email: data.email } });
        if (existingUser) throw new Error("User email already exists");
        user.email = data.email;
    }

    if (data.name) user.name = data.name;
    if (data.is_active !== undefined) user.is_active = data.is_active;

    if (data.nursery_id) {
        const nurseryRepo = AppDataSource.getRepository(Nursery);
        const nursery = await nurseryRepo.findOne({ where: { id: data.nursery_id } });
        if (!nursery) throw new Error("Nursery not found");
        user.nursery = nursery;
    }

    if (data.role_id !== undefined) {
        if (data.role_id === null) {
             // تعيين الدور كـ undefined بدلاً من null لتجنب مشاكل TypeORM
            user.role = undefined as unknown as Role; 
        } else {
            const roleRepo = AppDataSource.getRepository(Role);
            const role = await roleRepo.findOne({ where: { id: data.role_id } });
            if (!role) throw new Error("Role not found");
            user.role = role;
        }
    }

    if (data.password) {
        user.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await userRepo.save(user);
     // إزالة الباسورد باستخدام Destructuring بدلاً من any
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
};

export const deleteUserService = async (id: number) => {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id } });

    if (!user) throw new Error("User not found");

    await userRepo.remove(user);
    return true;
};