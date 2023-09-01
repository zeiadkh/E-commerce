import Router from "express"
import { isAuthenticated } from "../../middleware/authentication.js"
import isValid from "../../middleware/isValid.js"
import { createSchema, cancelSchema } from "./order.validator.js"
import { cancelOrder, create } from "./order.controller.js"

const router = new Router()

router.post("/", isAuthenticated, isValid(createSchema), create)

router.patch("/:orderId", isValid(cancelSchema), cancelOrder)

export default router