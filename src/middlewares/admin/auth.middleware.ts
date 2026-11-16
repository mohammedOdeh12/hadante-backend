import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// Extend Express Request to include admin payload
export interface AuthRequest extends Request {
    admin?: any;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    // 1. Check if token exists in headers
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ 
            success: false, 
            message: "Access denied. No token provided." 
        });
        return;
    }

    // 2. Extract token string
    const token = authHeader.split(" ")[1];

    try {
        // 3. Verify token validity
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // 4. Attach decoded payload to request object
        req.admin = decoded; 
        
        next(); // Proceed to the next middleware or controller
    } catch (error) {
        res.status(401).json({ 
            success: false, 
            message: "Invalid or expired token." 
        });
    }
};