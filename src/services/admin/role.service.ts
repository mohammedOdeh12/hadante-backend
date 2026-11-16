import { AppDataSource } from "../../config/database";
import { Role } from "../../entities/Role";
import { Permission } from "../../entities/Permission"; // تأكد من مسار الاستيراد
import { In } from "typeorm";

export const createRoleService = async (
  name: string,
  description?: string,
  permissionIds?: number[],
) => {
  const roleRepo = AppDataSource.getRepository(Role);
  const permissionRepo = AppDataSource.getRepository(Permission);

  const existingRole = await roleRepo.findOne({ where: { name } });
  if (existingRole) {
    throw new Error("Role name already exists");
  }

  const newRole = roleRepo.create({ name, description });

  // إذا تم تمرير صلاحيات، قم بجلبها من قاعدة البيانات وربطها بالدور
  if (permissionIds && permissionIds.length > 0) {
    const permissions = await permissionRepo.find({
      where: { id: In(permissionIds) },
    });
    newRole.permissions = permissions;
  }

  return await roleRepo.save(newRole);
};

export const getRolesService = async () => {
  const roleRepo = AppDataSource.getRepository(Role);
  return await roleRepo.find({
    relations: { 
        permissions: true,
        users: true // <-- التعديل هنا: جلب المستخدمين المرتبطين بالدور
    },
    order: { created_at: "DESC" },
  });
};
export const getRoleByIdService = async (id: number) => {
  const roleRepo = AppDataSource.getRepository(Role);
  const role = await roleRepo.findOne({
    where: { id },
    relations: { 
        permissions: true,
        users: true // <-- التعديل هنا أيضاً
    }, 
  });

  if (!role) {
    throw new Error("Role not found");
  }

  return role;
};

export const updateRoleService = async (
  id: number,
  name?: string,
  description?: string,
  permissionIds?: number[],
) => {
  const roleRepo = AppDataSource.getRepository(Role);
  const permissionRepo = AppDataSource.getRepository(Permission);

  // جلب الدور مع صلاحياته الحالية
  const role = await roleRepo.findOne({
    where: { id },
    relations: { permissions: true },
  });

  if (!role) {
    throw new Error("Role not found");
  }

  if (name && name !== role.name) {
    const existingRole = await roleRepo.findOne({ where: { name } });
    if (existingRole) {
      throw new Error("Role name already exists");
    }
    role.name = name;
  }

  if (description !== undefined) {
    role.description = description;
  }

  // تحديث الصلاحيات إذا تم تمريرها
  if (permissionIds !== undefined) {
    if (permissionIds.length > 0) {
      const permissions = await permissionRepo.find({
        where: { id: In(permissionIds) },
      });
      role.permissions = permissions;
    } else {
      // إذا تم إرسال مصفوفة فارغة، يعني أنه تم مسح جميع الصلاحيات
      role.permissions = [];
    }
  }

  return await roleRepo.save(role);
};

export const deleteRoleService = async (id: number) => {
  const roleRepo = AppDataSource.getRepository(Role);
  const role = await roleRepo.findOne({ where: { id } });

  if (!role) {
    throw new Error("Role not found");
  }

  await roleRepo.remove(role);
  return true;
};
