import { Request, Response } from "express";
import {
    createSuperAdminService,
    getSuperAdminsService,
    getSuperAdminByIdService,
    updateSuperAdminService,
    deleteSuperAdminService
} from "../../services/admin/superAdmin.service";

export const createSuperAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, role_id } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ success: false, message: "Name, email, and password are required" });
            return;
        }
        
        const admin = await createSuperAdminService(req.body);
        res.status(201).json({ success: true, message: "Super Admin created successfully", data: admin });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getSuperAdmins = async (req: Request, res: Response): Promise<void> => {
    try {
        const admins = await getSuperAdminsService();
        res.status(200).json({ success: true, data: admins });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Server error while fetching Super Admins" });
    }
};

export const getSuperAdminById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: "Invalid ID format" });
            return;
        }
        const admin = await getSuperAdminByIdService(id);
        res.status(200).json({ success: true, data: admin });
    } catch (error: any) {
        res.status(404).json({ success: false, message: error.message });
    }
};

export const updateSuperAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: "Invalid ID format" });
            return;
        }
        const updatedAdmin = await updateSuperAdminService(id, req.body);
        res.status(200).json({ success: true, message: "Super Admin updated successfully", data: updatedAdmin });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteSuperAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: "Invalid ID format" });
            return;
        }
        await deleteSuperAdminService(id);
        res.status(200).json({ success: true, message: "Super Admin deleted successfully" });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};