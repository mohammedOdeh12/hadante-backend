import { AppDataSource } from "../../config/database";
import { Media } from "../../entities/Media";
import { Nursery } from "../../entities/Nursery";

// تعريف الواجهة لتحديد نوع البيانات والتخلص من any
export interface MediaDTO {
    file_name: string;
    file_url: string;
    file_type: string;
    nursery_id?: number;
}

export const createMediaService = async (data: MediaDTO) => {
    const repo = AppDataSource.getRepository(Media);
    let nursery = null;
    
    if (data.nursery_id) {
        const nurseryRepo = AppDataSource.getRepository(Nursery);
        nursery = await nurseryRepo.findOne({ where: { id: data.nursery_id } });
        if (!nursery) throw new Error("Nursery not found");
    }

    const media = repo.create({
        file_name: data.file_name,
        file_url: data.file_url,
        file_type: data.file_type,
        nursery: nursery || undefined
    });
    return await repo.save(media);
};

export const getMediaService = async () => {
    const repo = AppDataSource.getRepository(Media);
    return await repo.find({ relations: { nursery: true }, order: { created_at: "DESC" } });
};

export const getMediaByIdService = async (id: number) => {
    const repo = AppDataSource.getRepository(Media);
    const media = await repo.findOne({ where: { id }, relations: { nursery: true } });
    if (!media) throw new Error("Media not found");
    return media;
};

export const deleteMediaService = async (id: number) => {
    const repo = AppDataSource.getRepository(Media);
    const media = await repo.findOne({ where: { id } });
    if (!media) throw new Error("Media not found");
    
    await repo.remove(media);
    return true;
};