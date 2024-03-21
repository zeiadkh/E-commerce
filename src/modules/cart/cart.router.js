import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import isValid from "../../middleware/isValid.js";
import { createAndUpdateSchema, deleteProductSchema } from "./cart.validatiion.js";
import { create, update, get, clearCart, deleteProduct } from "./cart.controller.js";
import catchError from "../../utils/catchError.js";

const router = new Router();

router.post("/", isAuthenticated, isValid(createAndUpdateSchema), catchError(create))

router.patch("/", isAuthenticated, isValid(createAndUpdateSchema), catchError(update))

router.get("/", isAuthenticated, catchError(get))

router.put("/", isAuthenticated, catchError(clearCart))

router.patch("/:pId", isAuthenticated, isValid(deleteProductSchema), catchError(deleteProduct))

export default router;