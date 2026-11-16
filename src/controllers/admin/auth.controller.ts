import { Request, Response } from "express";
import { adminLoginService } from "../../services/admin/auth.service";
export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ 
                success: false, 
                message: "Email and password are required" 
            });
            return;
        }

        const result = await adminLoginService(email, password);
        
        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            data: result
        });
    } catch (error: any) {
        res.status(401).json({
            success: false,
            message: error.message || "An error occurred during login"
        });
    }
};