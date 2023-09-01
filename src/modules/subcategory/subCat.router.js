import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import {
  createSchema,
  deleteSchema,
  updateSchema,
} from "./subCat.validation.js";
import isValid from "../../middleware/isValid.js";
import catchError from "../../utils/catchError.js";
import isAuthroized from "../../middleware/authroization.js";
import { create, update, deleteSubCat, get  } from "./subCat.controller.js";
import uploadFile, { typesObj } from "../../utils/multer.js";

const router = new Router({mergeParams: true});

router.post(
  "/",
  isAuthenticated,
  isAuthroized("admin"),
  uploadFile(typesObj.img).single("subCatImg"),
  isValid(createSchema),
  catchError(create)
);

router.patch(
  "/:subCatId",
  isAuthenticated,
  isAuthroized("admin"),
  uploadFile(typesObj.img).single("subCatImg"),
  isValid(updateSchema),
  catchError(update)
);

router.delete("/:subCatId", isValid(deleteSchema), catchError(deleteSubCat));

router.get("/get", catchError(get));

export default router;
