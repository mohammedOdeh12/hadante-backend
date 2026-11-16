import { AppDataSource } from "../../config/database";
import { Nursery } from "../../entities/Nursery";
import { NurserySubscription } from "../../entities/NurserySubscription"; // استدعاء كيان الاشتراكات

// تعريف واجهة البيانات للتخلص من any واستقبال حالة الاشتراك
export interface NurseryDTO {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    main_color?: string;
    is_active?: boolean;
    logo_id?: number | null;
    subscription_status?: string; // الحقل الجديد الخاص بحالة الاشتراك
}

export const createNurseryService = async (data: NurseryDTO) => {
    const nurseryRepo = AppDataSource.getRepository(Nursery);

    if (!data.email || !data.name) {
        throw new Error("Name and email are required");
    }

    const existingNursery = await nurseryRepo.findOne({ where: { email: data.email } });
    if (existingNursery) {
        throw new Error("Nursery email already exists");
    }

    const newNursery = nurseryRepo.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        main_color: data.main_color,
        is_active: data.is_active !== undefined ? data.is_active : true,
        logo: data.logo_id ? { id: data.logo_id } : undefined
    });

    return await nurseryRepo.save(newNursery);
};

export const getNurseriesService = async () => {
    const nurseryRepo = AppDataSource.getRepository(Nursery);
    return await nurseryRepo.find({ 
        order: { created_at: "DESC" },
        relations: {
            logo: true, 
            subscriptions: {
                plan: true
            },
            // التعديل هنا: جلب المستخدمين مع أدوارهم
            users: {
                role: true
            } 
        }
    });
};

export const getNurseryByIdService = async (id: number) => {
    const nurseryRepo = AppDataSource.getRepository(Nursery);
    const nursery = await nurseryRepo.findOne({ 
        where: { id },
        relations: {
            logo: true, 
            subscriptions: {
                plan: true
            },
            // التعديل هنا: جلب المستخدمين مع أدوارهم
            users: {
                role: true
            } 
        }
    });
    
    if (!nursery) throw new Error("Nursery not found");
    return nursery;
};

export const updateNurseryService = async (id: number, data: NurseryDTO) => {
    const nurseryRepo = AppDataSource.getRepository(Nursery);
    const nursery = await nurseryRepo.findOne({ where: { id } });

    if (!nursery) throw new Error("Nursery not found");

    if (data.email && data.email !== nursery.email) {
        const existingNursery = await nurseryRepo.findOne({ where: { email: data.email } });
        if (existingNursery) throw new Error("Nursery email already exists");
        nursery.email = data.email;
    }

    if (data.name) nursery.name = data.name;
    if (data.phone !== undefined) nursery.phone = data.phone;
    if (data.address !== undefined) nursery.address = data.address;
    if (data.main_color !== undefined) nursery.main_color = data.main_color;
    if (data.is_active !== undefined) nursery.is_active = data.is_active;
    
    if (data.logo_id !== undefined) {
        nursery.logo = data.logo_id ? ({ id: data.logo_id } as any) : null;
    }

    // 1. حفظ التعديلات الخاصة ببيانات الحضانة الأساسية أولاً
    await nurseryRepo.save(nursery);

    // 2. تحديث حالة الاشتراك (Subscription Status)
    if (data.subscription_status) {
        const subRepo = AppDataSource.getRepository(NurserySubscription);
        
        // البحث عن أحدث اشتراك مرتبط بهذه الحضانة
        const subscription = await subRepo.findOne({
            where: { nursery: { id } },
            order: { created_at: "DESC" } 
        });

        // إذا وجدنا اشتراك، نقوم بتحديث حالته
        if (subscription) {
            subscription.status = data.subscription_status;
            await subRepo.save(subscription);
        }
    }

    return nursery;
};

export const deleteNurseryService = async (id: number) => {
    const nurseryRepo = AppDataSource.getRepository(Nursery);
    const nursery = await nurseryRepo.findOne({ where: { id } });
    
    if (!nursery) throw new Error("Nursery not found");
    
    await nurseryRepo.remove(nursery);
    return true;
};