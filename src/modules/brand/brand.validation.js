import joi from 'joi';
import { idValidator } from '../category/category.valid.schema.js';

export const createSchema = joi.object({
  name: joi.string().min(3).required(),
});

export const updateSchema = joi.object({
    brandId: joi.string().custom(idValidator).required(),
    name: joi.string().min(3),
})

export const deleteSchema = joi.object({
    brandId: joi.string().custom(idValidator).required(),

})