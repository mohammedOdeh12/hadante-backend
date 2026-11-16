import { Router } from "express";
import {
    createNurserySubscription,
    getNurserySubscriptions,
    getNurserySubscriptionById,
    updateNurserySubscription,
    deleteNurserySubscription
} from "../../controllers/admin/nurserySubscription.controller";
import { verifyToken } from "../../middlewares/admin/auth.middleware";

const router = Router();

router.use(verifyToken);

router.route("/")
    .post(createNurserySubscription)
    .get(getNurserySubscriptions);

router.route("/:id")
    .get(getNurserySubscriptionById)
    .put(updateNurserySubscription)
    .delete(deleteNurserySubscription);

export default router;