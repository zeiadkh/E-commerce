import { isAuthenticated } from "../../middleware/authentication.js";
import isAuthroized from "../../middleware/authroization.js";
import isValid from "../../middleware/isValid.js";
import uploadFile, { typesObj } from "../../utils/multer.js";
import { createSchema,  idCheckSchema } from "./product.validtion.js";
import { Router } from "express";
import { create, deleteProduct, get, getProductsOfCategory, getSingleProduct } from "./product.controller.js";
import catchError from "../../utils/catchError.js";

const router = new Router({mergeParams: true});

router.post(
  "/",
  isAuthenticated,
  isAuthroized("admin"),
  uploadFile(typesObj.img).fields([
    { name: "defaultImg", maxCount: 1 },
    { name: "imgs", maxCount: 5 },
  ]),
  isValid(createSchema),
  catchError(create)
);
/*
router.patch(
  "/:pId",
  isAuthenticated,
  isAuthroized("admin"),
  uploadFile().single('imgs'),
  isValid(updateSchema),
  update
);
*/
router.delete(
  "/:pId",
  isAuthenticated,
  isAuthroized("admin"),
  isValid(idCheckSchema),
  catchError(deleteProduct)
);
router.get(
  "/all",
  get
);

router.get("/:pId", isValid(idCheckSchema), getSingleProduct)

router.get("/", getProductsOfCategory)
export default router;
