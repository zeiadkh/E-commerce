import joi from 'joi';
import {idValidator} from '../category/category.valid.schema.js'

export const createSchema = joi.object({
    discount: joi.number().max(100).required(),
    expireAt: joi.date().greater(Date.now()).required(),
});

export const updateSchema = joi.object({
    code: joi.string().min(5).max(5).required(),
    discount: joi.number().min(1).max(100),
    expireAt: joi.date().greater(Date.now())
});

export const deleteSchema = joi.object({
  code: joi.string().min(5).max(5).required(),
});
