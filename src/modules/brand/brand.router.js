import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import {
  createSchema,
  deleteSchema,
  updateSchema,
} from "./brand.validation.js";
import isValid from "../../middleware/isValid.js";
import isAuthroized from "../../middleware/authroization.js";
import catchError from "../../utils/catchError.js";
import { create, update, get, deleteBrand  } from "./brand.controller.js";
import uploadFile, { typesObj } from "../../utils/multer.js";

const router = new Router({mergeParams: true});

router.post(
  "/",
  isAuthenticated,
  isAuthroized("admin"),
  uploadFile(typesObj.img).single("brandImg"),
  isValid(createSchema),
  catchError(create)
);

router.patch(
  "/:brandId",
  isAuthenticated,
  isAuthroized("admin"),
  uploadFile(typesObj.img).single("brandImg"),
  isValid(updateSchema),
  catchError(update)
);

router.delete("/:brandId", isValid(deleteSchema), catchError(deleteBrand));

router.get("/", catchError(get));

export default router;
