import { AppDataSource } from "../../config/database";
import { SubscriptionPlan } from "../../entities/SubscriptionPlan";

export const createSubscriptionPlanService = async (data: any) => {
    const planRepo = AppDataSource.getRepository(SubscriptionPlan);

    const existingPlan = await planRepo.findOne({ where: { name: data.name } });
    if (existingPlan) {
        throw new Error("Subscription plan name already exists");
    }

    const newPlan = planRepo.create({
        name: data.name,
        monthly_price: data.monthly_price,
        yearly_price: data.yearly_price,
        max_children: data.max_children,
        ai_reports_enabled: data.ai_reports_enabled !== undefined ? data.ai_reports_enabled : false,
        description: data.description,
        is_active: data.is_active !== undefined ? data.is_active : true
    });

    return await planRepo.save(newPlan);
};

export const getSubscriptionPlansService = async () => {
    const planRepo = AppDataSource.getRepository(SubscriptionPlan);
    return await planRepo.find({ order: { created_at: "DESC" } });
};

export const getSubscriptionPlanByIdService = async (id: number) => {
    const planRepo = AppDataSource.getRepository(SubscriptionPlan);
    const plan = await planRepo.findOne({ where: { id } });
    
    if (!plan) throw new Error("Subscription plan not found");
    return plan;
};

export const updateSubscriptionPlanService = async (id: number, data: any) => {
    const planRepo = AppDataSource.getRepository(SubscriptionPlan);
    const plan = await planRepo.findOne({ where: { id } });

    if (!plan) throw new Error("Subscription plan not found");

    if (data.name && data.name !== plan.name) {
        const existingPlan = await planRepo.findOne({ where: { name: data.name } });
        if (existingPlan) throw new Error("Subscription plan name already exists");
        plan.name = data.name;
    }

    // تحديث الحقول الجديدة
    if (data.monthly_price !== undefined) plan.monthly_price = data.monthly_price;
    if (data.yearly_price !== undefined) plan.yearly_price = data.yearly_price;
    if (data.max_children !== undefined) plan.max_children = data.max_children;
    if (data.ai_reports_enabled !== undefined) plan.ai_reports_enabled = data.ai_reports_enabled;
    if (data.description !== undefined) plan.description = data.description;
    if (data.is_active !== undefined) plan.is_active = data.is_active;

    return await planRepo.save(plan);
};

export const deleteSubscriptionPlanService = async (id: number) => {
    const planRepo = AppDataSource.getRepository(SubscriptionPlan);
    const plan = await planRepo.findOne({ where: { id } });
    
    if (!plan) throw new Error("Subscription plan not found");
    
    await planRepo.remove(plan);
    return true;
};