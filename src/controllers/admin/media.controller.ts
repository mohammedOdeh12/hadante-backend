import { Request, Response } from "express";
import {
    createMediaService, getMediaService, getMediaByIdService, deleteMediaService
} from "../../services/admin/media.service";

export const createMedia = async (req: Request, res: Response): Promise<void> => {
    try {
        if (req.file) {
            // استخدام الترويسات الخاصة بالـ Proxy (ngrok) للحصول على الرابط الفعلي دائماً
            const protocol = req.headers['x-forwarded-proto'] || req.protocol; 
            const host = req.headers['x-forwarded-host'] || req.get('host'); 
            
            // حفظ الرابط الكامل مباشرة في قاعدة البيانات
            req.body.file_url = `${protocol}://${host}/uploads/nurseries/${req.file.filename}`;
            req.body.file_name = req.file.filename;
            req.body.file_type = req.file.mimetype;
        }

        const { file_name, file_url, file_type } = req.body;
        
        if (!file_name || !file_url || !file_type) { 
            res.status(400).json({ success: false, message: "لم يتم رفع أي ملف أو البيانات ناقصة" }); 
            return; 
        }

        const media = await createMediaService(req.body);
        res.status(201).json({ success: true, data: media });
    } catch (error: any) { 
        res.status(400).json({ success: false, message: error.message }); 
    }
};

export const getMedia = async (req: Request, res: Response): Promise<void> => {
    try {
        const media = await getMediaService();
        res.status(200).json({ success: true, data: media });
    } catch (error: any) { 
        res.status(500).json({ success: false, message: "Server error" }); 
    }
};

export const getMediaById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) { 
            res.status(400).json({ success: false, message: "Invalid ID" }); 
            return; 
        }
        const media = await getMediaByIdService(id);
        res.status(200).json({ success: true, data: media });
    } catch (error: any) { 
        res.status(404).json({ success: false, message: error.message }); 
    }
};

export const deleteMedia = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) { 
            res.status(400).json({ success: false, message: "Invalid ID" }); 
            return; 
        }
        await deleteMediaService(id);
        res.status(200).json({ success: true, message: "Media deleted" });
    } catch (error: any) { 
        res.status(400).json({ success: false, message: error.message }); 
    }
};