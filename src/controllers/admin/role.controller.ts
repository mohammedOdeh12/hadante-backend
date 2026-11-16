import { Request, Response } from "express";
import {
  createRoleService,
  getRolesService,
  getRoleByIdService,
  updateRoleService,
  deleteRoleService,
} from "../../services/admin/role.service";

export const createRole = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // استخراج permissionIds من الـ body
    const { name, description, permissionIds } = req.body;
    if (!name) {
      res
        .status(400)
        .json({ success: false, message: "Role name is required" });
      return;
    }
    // تمرير permissionIds للسيرفس
    const role = await createRoleService(name, description, permissionIds);
    res
      .status(201)
      .json({
        success: true,
        message: "Role created successfully",
        data: role,
      });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getRoles = async (req: Request, res: Response): Promise<void> => {
  try {
    const roles = await getRolesService();
    res.status(200).json({ success: true, data: roles });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching roles" });
  }
};

export const getRoleById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: "Invalid ID format" });
      return;
    }
    const role = await getRoleByIdService(id);
    res.status(200).json({ success: true, data: role });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updateRole = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: "Invalid ID format" });
      return;
    }

    // استخراج permissionIds وتمريرها
    const { name, description, permissionIds } = req.body;
    const updatedRole = await updateRoleService(id, name, description, permissionIds);
    res
      .status(200)
      .json({
        success: true,
        message: "Role updated successfully",
        data: updatedRole,
      });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteRole = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: "Invalid ID format" });
      return;
    }
    await deleteRoleService(id);
    res
      .status(200)
      .json({ success: true, message: "Role deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};