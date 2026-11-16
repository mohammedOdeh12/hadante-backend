import { Request, Response } from "express";
import {
    createNurserySubscriptionService,
    getNurserySubscriptionsService,
    getNurserySubscriptionByIdService,
    updateNurserySubscriptionService,
    deleteNurserySubscriptionService
} from "../../services/admin/nurserySubscription.service";

export const createNurserySubscription = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nursery_id, plan_id, start_date, end_date, amount_paid } = req.body;
        
        if (!nursery_id || !plan_id || !start_date || !end_date || amount_paid === undefined) {
            res.status(400).json({ success: false, message: "nursery_id, plan_id, start_date, end_date, and amount_paid are required" });
            return;
        }

        const sub = await createNurserySubscriptionService(req.body);
        res.status(201).json({ success: true, message: "Subscription created successfully", data: sub });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getNurserySubscriptions = async (req: Request, res: Response): Promise<void> => {
    try {
        const subs = await getNurserySubscriptionsService();
        res.status(200).json({ success: true, data: subs });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Server error while fetching subscriptions" });
    }
};

export const getNurserySubscriptionById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: "Invalid ID format" });
            return;
        }
        const sub = await getNurserySubscriptionByIdService(id);
        res.status(200).json({ success: true, data: sub });
    } catch (error: any) {
        res.status(404).json({ success: false, message: error.message });
    }
};

export const updateNurserySubscription = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: "Invalid ID format" });
            return;
        }
        const updatedSub = await updateNurserySubscriptionService(id, req.body);
        res.status(200).json({ success: true, message: "Subscription updated successfully", data: updatedSub });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteNurserySubscription = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: "Invalid ID format" });
            return;
        }
        await deleteNurserySubscriptionService(id);
        res.status(200).json({ success: true, message: "Subscription deleted successfully" });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};