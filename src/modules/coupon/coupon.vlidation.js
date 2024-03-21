import joi from "joi";

export const createSchema = joi.object({
  discount: joi.number().min(1).max(100).required(),
  expireAt: joi
    .date()
    .greater(Date.now())
    .required()
    .error( err => { err[0].message= "Expire date must be valid"; return err; } )
    
    
    // .label("expire date must be valid date")
  });
  
  export const updateSchema = joi.object({
    code: joi.string().min(5).max(5).required(),
    discount: joi.number().min(1).max(100),
    expireAt: joi.date().greater(Date.now())
    .error( err => { err[0].message= "Expire date must be valid"; return err; } )
});

export const deleteSchema = joi.object({
  code: joi.string().min(5).max(5).required(),
});
