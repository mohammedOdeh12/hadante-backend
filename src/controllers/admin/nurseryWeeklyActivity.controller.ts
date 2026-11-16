import { Request, Response } from "express";
import {
    createActivityService,
    getActivitiesService,
    getActivityByIdService,
    updateActivityService,
    deleteActivityService
} from "../../services/admin/nurseryWeeklyActivity.service";

export const createActivity = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nursery_id, title, day_of_week } = req.body;
        
        if (!nursery_id || !title || !day_of_week) {
            res.status(400).json({ success: false, message: "nursery_id, title, and day_of_week are required" });
            return;
        }

        const activity = await createActivityService(req.body);
        res.status(201).json({ success: true, message: "Activity created successfully", data: activity });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getActivities = async (req: Request, res: Response): Promise<void> => {
    try {
        const activities = await getActivitiesService();
        res.status(200).json({ success: true, data: activities });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Server error while fetching activities" });
    }
};

export const getActivityById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: "Invalid ID format" });
            return;
        }
        const activity = await getActivityByIdService(id);
        res.status(200).json({ success: true, data: activity });
    } catch (error: any) {
        res.status(404).json({ success: false, message: error.message });
    }
};

export const updateActivity = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: "Invalid ID format" });
            return;
        }
        const updatedActivity = await updateActivityService(id, req.body);
        res.status(200).json({ success: true, message: "Activity updated successfully", data: updatedActivity });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteActivity = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: "Invalid ID format" });
            return;
        }
        await deleteActivityService(id);
        res.status(200).json({ success: true, message: "Activity deleted successfully" });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};