import { Router } from "express";
import { create, update, deleteCoupon, get } from "./coupon.controller.js";
import {
  createSchema,
  updateSchema,
  deleteSchema,
} from "./coupon.vlidation.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import isAuthroized from "../../middleware/authroization.js";
import isValid from "../../middleware/isValid.js";
import catchError from "../../utils/catchError.js";

const router = new Router();

router.post(
  "/",
  isAuthenticated,
  isAuthroized("admin"),
  isValid(createSchema),
  catchError(create)
);

router.patch(
  "/:code",
  isAuthenticated,
  isAuthroized("admin"),
  isValid(updateSchema),
  catchError(update)
);

router.delete(
  "/:code",
  isAuthenticated,
  isAuthroized("admin"),
  isValid(deleteSchema),
  catchError(deleteCoupon)
);

router.get("/", get);

export default router;
