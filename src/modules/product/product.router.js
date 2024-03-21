import { isAuthenticated } from "../../middleware/authentication.js";
import isAuthroized from "../../middleware/authroization.js";
import isValid from "../../middleware/isValid.js";
import uploadFile, { typesObj } from "../../utils/multer.js";
import { createSchema,  idCheckSchema, updateSchema } from "./product.validtion.js";
import { Router } from "express";
import { create, deleteProduct, get, getProductsOfCategory, getSingleProduct,update } from "./product.controller.js";
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

router.patch(
  "/:pId",
  isAuthenticated,
  isAuthroized("admin"),
  uploadFile(typesObj.img).fields([
    {name: "defaultImg", maxCount: 1},
    {name: "imgs", maxCount:5}
  ]),
  isValid(updateSchema),
  catchError(update)
);

router.delete(
  "/:pId",
  isAuthenticated,
  isAuthroized("admin"),
  isValid(idCheckSchema),
  catchError(deleteProduct)
);
router.get(
  "/all",
  catchError(get)
);

router.get("/:pId", isValid(idCheckSchema), catchError(getSingleProduct))

router.get("/", catchError(getProductsOfCategory))
export default router;
