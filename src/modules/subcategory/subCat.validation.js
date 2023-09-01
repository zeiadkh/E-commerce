import joi from 'joi';
import { idValidator } from '../category/category.valid.schema.js';

export const createSchema = joi.object({
  name: joi.string().min(3).required(),
  catId: joi.string().custom(idValidator).required(),
});

export const updateSchema = joi.object({
    subCatId: joi.string().custom(idValidator).required(),
    name: joi.string().min(3),
    catId: joi.string().custom(idValidator).required()
})

export const deleteSchema = joi.object({
    subCatId: joi.string().custom(idValidator).required(),
    catId: joi.string().custom(idValidator).required()

})