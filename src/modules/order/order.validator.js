import joi from 'joi';
import { idValidator } from '../category/category.valid.schema.js';



export const createSchema = joi.object({
    phone: joi.string().pattern(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/i).required(),
    payment: joi.string().valid('cash', 'visa'),
    address: joi.string().min(10).required(),
    coupon: joi.string()
}).required()

export const cancelSchema = joi.object({
    orderId: joi.string().custom(idValidator).required()
}).required()