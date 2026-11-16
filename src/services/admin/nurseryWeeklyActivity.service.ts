import { AppDataSource } from "../../config/database";
import { NurseryWeeklyActivity } from "../../entities/NurseryWeeklyActivity";
import { Nursery } from "../../entities/Nursery";

export const createActivityService = async (data: any) => {
    const repo = AppDataSource.getRepository(NurseryWeeklyActivity);
    const nurseryRepo = AppDataSource.getRepository(Nursery);

    const nursery = await nurseryRepo.findOne({ where: { id: data.nursery_id } });
    if (!nursery) throw new Error("Nursery not found");

    const newActivity = repo.create({
        title: data.title,
        description: data.description,
        day_of_week: data.day_of_week,
        nursery
    });

    return await repo.save(newActivity);
};

export const getActivitiesService = async () => {
    const repo = AppDataSource.getRepository(NurseryWeeklyActivity);
    return await repo.find({ 
        relations: { nursery: true }, 
        order: { created_at: "DESC" } 
    });
};

export const getActivityByIdService = async (id: number) => {
    const repo = AppDataSource.getRepository(NurseryWeeklyActivity);
    const activity = await repo.findOne({ 
        where: { id },
        relations: { nursery: true }
    });
    
    if (!activity) throw new Error("Activity not found");
    return activity;
};

export const updateActivityService = async (id: number, data: any) => {
    const repo = AppDataSource.getRepository(NurseryWeeklyActivity);
    const nurseryRepo = AppDataSource.getRepository(Nursery);

    const activity = await repo.findOne({ where: { id } });
    if (!activity) throw new Error("Activity not found");

    if (data.nursery_id) {
        const nursery = await nurseryRepo.findOne({ where: { id: data.nursery_id } });
        if (!nursery) throw new Error("Nursery not found");
        activity.nursery = nursery;
    }

    if (data.title) activity.title = data.title;
    if (data.description !== undefined) activity.description = data.description;
    if (data.day_of_week) activity.day_of_week = data.day_of_week;

    return await repo.save(activity);
};

export const deleteActivityService = async (id: number) => {
    const repo = AppDataSource.getRepository(NurseryWeeklyActivity);
    const activity = await repo.findOne({ where: { id } });
    
    if (!activity) throw new Error("Activity not found");
    
    await repo.remove(activity);
    return true;
};