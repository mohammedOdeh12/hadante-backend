import { Request, Response } from "express";
import {
  createPermissionService,
  getPermissionsService,
  getPermissionByIdService,
  updatePermissionService,
  deletePermissionService,
} from "../../services/admin/permission.service";

export const createPermission = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ success: false, message: "Name is required" });
      return;
    }
    const permission = await createPermissionService(req.body);
    res.status(201).json({ success: true, data: permission });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPermissions = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const permissions = await getPermissionsService();
    res.status(200).json({ success: true, data: permissions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getPermissionById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: "Invalid ID" });
      return;
    }
    const permission = await getPermissionByIdService(id);
    res.status(200).json({ success: true, data: permission });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updatePermission = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: "Invalid ID" });
      return;
    }
    const updated = await updatePermissionService(id, req.body);
    res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deletePermission = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: "Invalid ID" });
      return;
    }
    await deletePermissionService(id);
    res.status(200).json({ success: true, message: "Permission deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
