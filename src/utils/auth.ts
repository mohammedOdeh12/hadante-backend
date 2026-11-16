import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// دالة لتشفير كلمة المرور
export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

// دالة لمقارنة كلمة المرور
export const comparePasswords = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};

// دالة لتوليد رمز JWT
export const generateToken = (payload: object): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
};