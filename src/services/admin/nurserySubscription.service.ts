import { AppDataSource } from "../../config/database";
import { NurserySubscription } from "../../entities/NurserySubscription";
import { Nursery } from "../../entities/Nursery";
import { SubscriptionPlan } from "../../entities/SubscriptionPlan";

export const createNurserySubscriptionService = async (data: any) => {
    const subRepo = AppDataSource.getRepository(NurserySubscription);
    const nurseryRepo = AppDataSource.getRepository(Nursery);
    const planRepo = AppDataSource.getRepository(SubscriptionPlan);

    const nursery = await nurseryRepo.findOne({ where: { id: data.nursery_id } });
    if (!nursery) throw new Error("Nursery not found");

    const plan = await planRepo.findOne({ where: { id: data.plan_id } });
    if (!plan) throw new Error("Subscription plan not found");

    const newSub = subRepo.create({
        nursery,
        plan,
        start_date: data.start_date,
        end_date: data.end_date,
        amount_paid: data.amount_paid,
        status: data.status || "active"
    });

    return await subRepo.save(newSub);
};

export const getNurserySubscriptionsService = async () => {
    const subRepo = AppDataSource.getRepository(NurserySubscription);
    return await subRepo.find({ 
        relations: { nursery: true, plan: true }, 
        order: { created_at: "DESC" } 
    });
};

export const getNurserySubscriptionByIdService = async (id: number) => {
    const subRepo = AppDataSource.getRepository(NurserySubscription);
    const sub = await subRepo.findOne({ 
        where: { id },
        relations: { nursery: true, plan: true } 
    });
    
    if (!sub) throw new Error("Subscription not found");
    return sub;
};

export const updateNurserySubscriptionService = async (id: number, data: any) => {
    const subRepo = AppDataSource.getRepository(NurserySubscription);
    const nurseryRepo = AppDataSource.getRepository(Nursery);
    const planRepo = AppDataSource.getRepository(SubscriptionPlan);

    const sub = await subRepo.findOne({ where: { id } });
    if (!sub) throw new Error("Subscription not found");

    if (data.nursery_id) {
        const nursery = await nurseryRepo.findOne({ where: { id: data.nursery_id } });
        if (!nursery) throw new Error("Nursery not found");
        sub.nursery = nursery;
    }

    if (data.plan_id) {
        const plan = await planRepo.findOne({ where: { id: data.plan_id } });
        if (!plan) throw new Error("Subscription plan not found");
        sub.plan = plan;
    }

    if (data.start_date) sub.start_date = data.start_date;
    if (data.end_date) sub.end_date = data.end_date;
    if (data.amount_paid !== undefined) sub.amount_paid = data.amount_paid;
    if (data.status) sub.status = data.status;

    return await subRepo.save(sub);
};

export const deleteNurserySubscriptionService = async (id: number) => {
    const subRepo = AppDataSource.getRepository(NurserySubscription);
    const sub = await subRepo.findOne({ where: { id } });
    
    if (!sub) throw new Error("Subscription not found");
    
    await subRepo.remove(sub);
    return true;
};