import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import isValid from "../../middleware/isValid.js";
import { createAndUpdateSchema, deleteProductSchema } from "./cart.validatiion.js";
import { create, update, get, clearCart, deleteProduct } from "./cart.controller.js";

const router = new Router();

router.post("/", isAuthenticated, isValid(createAndUpdateSchema), create)

router.patch("/", isAuthenticated, isValid(createAndUpdateSchema), update)

router.get("/", isAuthenticated, get)

router.put("/", isAuthenticated, clearCart)

router.patch("/:pId", isAuthenticated, isValid(deleteProductSchema), deleteProduct)

export default router;