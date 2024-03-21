import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import catchError from "../../utils/catchError.js";
import { create } from "./review.controller.js";

const router = new Router();

router.post("/", isAuthenticated, catchError(create))

export default router;