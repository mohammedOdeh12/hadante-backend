import { Request, Response } from "express";
import {
    createUserService,
    getUsersService,
    getUserByIdService,
    updateUserService,
    deleteUserService
} from "../../services/admin/user.service";

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        if (req.body.is_active !== undefined) {
            req.body.is_active = req.body.is_active === "true" || req.body.is_active === true;
        }

        const user = await createUserService(req.body);
        res.status(201).json({ success: true, message: "User created successfully", data: user });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await getUsersService();
        res.status(200).json({ success: true, data: users });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Server error while fetching users" });
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: "Invalid ID format" });
            return;
        }
        
        const user = await getUserByIdService(id);
        res.status(200).json({ success: true, data: user });
    } catch (error: any) {
        res.status(404).json({ success: false, message: error.message });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: "Invalid ID format" });
            return;
        }

        if (req.body.is_active !== undefined) {
            req.body.is_active = req.body.is_active === "true" || req.body.is_active === true;
        }

        const updatedUser = await updateUserService(id, req.body);
        res.status(200).json({ success: true, message: "User updated successfully", data: updatedUser });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: "Invalid ID format" });
            return;
        }
        
        await deleteUserService(id);
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};