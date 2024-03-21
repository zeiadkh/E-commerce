import joi from 'joi'
import { idValidator } from '../category/category.valid.schema.js'

export const createSchema = joi.object({
  name: joi.string().min(3).required(),
  description: joi.string().min(10).required(),
  price: joi.number().min(1).required(),
  category: joi.string().custom(idValidator).required(),
  subCategory: joi.string().custom(idValidator).required(),
  brand: joi.string().custom(idValidator).required(),
  availableItems: joi.number().min(1).required(),
  soldItems: joi.number(),
  discount: joi.number().max(100),
});

export const idCheckSchema = joi.object({
    pId: joi.string().custom(idValidator).required(),
})

export const updateSchema = joi.object({
  pId: joi.string().custom(idValidator).required(),
  name: joi.string().min(3),
  description: joi.string().min(10),
  price: joi.number().min(1),
  category: joi.string().custom(idValidator),
  subCategory: joi.string().custom(idValidator),
  brand: joi.string().custom(idValidator),
  availableItems: joi.number().min(1),
  soldItems: joi.number(),
  discount: joi.number().max(100),

})


