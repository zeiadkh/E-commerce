import joi from 'joi';
import { idValidator } from '../category/category.valid.schema.js';

export const createAndUpdateSchema = joi.object({

    pId: joi.string().custom(idValidator).required(),
    quantity: joi.number().min(1)

}
)
export const deleteProductSchema = joi.object({
    pId: joi.string().custom(idValidator).required(),
})
