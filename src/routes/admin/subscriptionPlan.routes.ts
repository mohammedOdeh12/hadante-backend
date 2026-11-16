import { Router } from "express";
import {
    createSubscriptionPlan,
    getSubscriptionPlans,
    getSubscriptionPlanById,
    updateSubscriptionPlan,
    deleteSubscriptionPlan
} from "../../controllers/admin/subscriptionPlan.controller";
import { verifyToken } from "../../middlewares/admin/auth.middleware";

const router = Router();

router.use(verifyToken);

router.route("/")
    .post(createSubscriptionPlan)
    .get(getSubscriptionPlans);

router.route("/:id")
    .get(getSubscriptionPlanById)
    .put(updateSubscriptionPlan)
    .delete(deleteSubscriptionPlan);

export default router;