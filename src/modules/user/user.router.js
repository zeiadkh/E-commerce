import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { get } from "./user.controller.js";
import catchError from "../../utils/catchError.js";

const router = new Router();

router.get("", isAuthenticated, catchError(get));

export default router;
