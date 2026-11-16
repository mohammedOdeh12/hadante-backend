import { Router } from "express";
import {
    createActivity,
    getActivities,
    getActivityById,
    updateActivity,
    deleteActivity
} from "../../controllers/admin/nurseryWeeklyActivity.controller";
import { verifyToken } from "../../middlewares/admin/auth.middleware";

const router = Router();

router.use(verifyToken);

router.route("/")
    .post(createActivity)
    .get(getActivities);

router.route("/:id")
    .get(getActivityById)
    .put(updateActivity)
    .delete(deleteActivity);

export default router;