import { Request, Response } from "express";
import {
    createSubscriptionPlanService,
    getSubscriptionPlansService,
    getSubscriptionPlanByIdService,
    updateSubscriptionPlanService,
    deleteSubscriptionPlanService
} from "../../services/admin/subscriptionPlan.service";

export const createSubscriptionPlan = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, monthly_price, yearly_price, max_children } = req.body;
        
        // التحقق من الحقول الأساسية الجديدة
        if (!name || monthly_price === undefined || yearly_price === undefined || max_children === undefined) {
            res.status(400).json({ 
                success: false, 
                message: "name, monthly_price, yearly_price, and max_children are required" 
            });
            return;
        }

        const plan = await createSubscriptionPlanService(req.body);
        res.status(201).json({ success: true, message: "Subscription plan created successfully", data: plan });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getSubscriptionPlans = async (req: Request, res: Response): Promise<void> => {
    try {
        const plans = await getSubscriptionPlansService();
        res.status(200).json({ success: true, data: plans });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Server error while fetching plans" });
    }
};

export const getSubscriptionPlanById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: "Invalid ID format" });
            return;
        }
        const plan = await getSubscriptionPlanByIdService(id);
        res.status(200).json({ success: true, data: plan });
    } catch (error: any) {
        res.status(404).json({ success: false, message: error.message });
    }
};

export const updateSubscriptionPlan = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: "Invalid ID format" });
            return;
        }
        const updatedPlan = await updateSubscriptionPlanService(id, req.body);
        res.status(200).json({ success: true, message: "Subscription plan updated successfully", data: updatedPlan });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteSubscriptionPlan = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: "Invalid ID format" });
            return;
        }
        await deleteSubscriptionPlanService(id);
        res.status(200).json({ success: true, message: "Subscription plan deleted successfully" });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};