import "reflect-metadata";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./config/database";
import { seedInitialData } from "./utils/seed";
import authRoutes from "./routes/admin/auth.routes"; // Added the auth routes import

import roleRoutes from "./routes/admin/role.routes"; // Register Role Routes

import superAdminRoutes from "./routes/admin/superAdmin.routes";

import nurseryRoutes from "./routes/admin/nursery.routes";

import subscriptionPlanRoutes from "./routes/admin/subscriptionPlan.routes";

import nurserySubscriptionRoutes from "./routes/admin/nurserySubscription.routes";

import nurseryWeeklyActivityRoutes from "./routes/admin/nurseryWeeklyActivity.routes";

import permissionRoutes from "./routes/admin/permission.routes";

import mediaRoutes from "./routes/admin/media.routes";

import userRoutes from "./routes/admin/user.routes";

import userAuthRoutes from "./routes/admin/userAuth.routes";

import path from "path";

// Initialize environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// Register Routes
app.use("/api/auth", authRoutes);

app.use("/api/admin/roles", roleRoutes);

app.use("/api/admin/super-admins", superAdminRoutes);

app.use("/api/admin/nurseries", nurseryRoutes);

app.use("/api/admin/subscription-plans", subscriptionPlanRoutes);

app.use("/api/admin/nursery-subscriptions", nurserySubscriptionRoutes);

app.use("/api/admin/weekly-activities", nurseryWeeklyActivityRoutes);

app.use("/api/admin/permissions", permissionRoutes);

app.use("/api/admin/media", mediaRoutes);

app.use("/api/admin/users", userRoutes);

app.use("/api/staff", userAuthRoutes); // سيكون الرابط /api/staff/login

// Health Check Route
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ 
        success: true, 
        message: "Welcome to Hadante API!" 
    });
});

// Initialize Database Connection and Start Server
AppDataSource.initialize()
    .then(async () => {
        console.log("✅ Database connected successfully!");

        // Run initial seeder for the first Super Admin
        await seedInitialData();
        
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("❌ Database connection failed. Error details:", error);
    });