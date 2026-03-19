import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
	getFocusHistory,
	getFocusStats,
	saveCompletedFocusSession,
} from "../controller/focus.controller.js";

const router = Router();

router.use(protectRoute);

router.post("/sessions", saveCompletedFocusSession);
router.get("/stats", getFocusStats);
router.get("/history", getFocusHistory);

export default router;
