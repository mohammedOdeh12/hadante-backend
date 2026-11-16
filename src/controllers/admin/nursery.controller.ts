import { Request, Response } from "express";
import {
  createNurseryService,
  getNurseriesService,
  getNurseryByIdService,
  updateNurseryService,
  deleteNurseryService,
} from "../../services/admin/nursery.service";

export const createNursery = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      res.status(400).json({
          success: false,
          message: "Name and email are required",
        });
      return;
    }

    // تحويل النص إلى Boolean في حال وصوله كـ String
    if (req.body.is_active !== undefined) {
      req.body.is_active = req.body.is_active === "true" || req.body.is_active === true;
    }

    const nursery = await createNurseryService(req.body);
    res.status(201).json({
        success: true,
        message: "Nursery created successfully",
        data: nursery,
      });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getNurseries = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const nurseries = await getNurseriesService();
    res.status(200).json({ success: true, data: nurseries });
  } catch (error: any) {
    res.status(500).json({
        success: false,
        message: "Server error while fetching nurseries",
      });
  }
};

export const getNurseryById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: "Invalid ID format" });
      return;
    }
    const nursery = await getNurseryByIdService(id);
    res.status(200).json({ success: true, data: nursery });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updateNursery = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);

    if (isNaN(id)) {
      res.status(400).json({ success: false, message: "Invalid ID format" });
      return;
    }

    // تحويل النص إلى Boolean في حال وصوله كـ String
    if (req.body.is_active !== undefined) {
      req.body.is_active = req.body.is_active === "true" || req.body.is_active === true;
    }

    const updatedNursery = await updateNurseryService(id, req.body);
    res.status(200).json({
        success: true,
        message: "Nursery updated successfully",
        data: updatedNursery,
      });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteNursery = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: "Invalid ID format" });
      return;
    }
    await deleteNurseryService(id);
    res.status(200).json({ success: true, message: "Nursery deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};