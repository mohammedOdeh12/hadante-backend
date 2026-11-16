import { AppDataSource } from "../../config/database";
import { Permission } from "../../entities/Permission";

export const createPermissionService = async (data: any) => {
    const repo = AppDataSource.getRepository(Permission);
    const existing = await repo.findOne({ where: { name: data.name } });
    if (existing) throw new Error("Permission name already exists");

    const permission = repo.create({
        name: data.name,
        description: data.description
    });
    return await repo.save(permission);
};

export const getPermissionsService = async () => {
    const repo = AppDataSource.getRepository(Permission);
    return await repo.find({ order: { created_at: "DESC" } });
};

export const getPermissionByIdService = async (id: number) => {
    const repo = AppDataSource.getRepository(Permission);
    const permission = await repo.findOne({ where: { id } });
    if (!permission) throw new Error("Permission not found");
    return permission;
};

export const updatePermissionService = async (id: number, data: any) => {
    const repo = AppDataSource.getRepository(Permission);
    const permission = await repo.findOne({ where: { id } });
    if (!permission) throw new Error("Permission not found");

    if (data.name && data.name !== permission.name) {
        const existing = await repo.findOne({ where: { name: data.name } });
        if (existing) throw new Error("Permission name already exists");
        permission.name = data.name;
    }
    if (data.description !== undefined) permission.description = data.description;

    return await repo.save(permission);
};

export const deletePermissionService = async (id: number) => {
    const repo = AppDataSource.getRepository(Permission);
    const permission = await repo.findOne({ where: { id } });
    if (!permission) throw new Error("Permission not found");
    
    await repo.remove(permission);
    return true;
};