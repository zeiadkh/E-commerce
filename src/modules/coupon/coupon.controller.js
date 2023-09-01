import Coupon from "../../../DB/models/coupon.model.js";
import voucher from "voucher-code-generator";

export const create = async (req, res, next) => {
  const createdBy = req.user.id;
  const name = voucher.generate({ length: 5 })[0];
  const expireAt = new Date(req.body.expireAt).getTime();
  const coupon = await Coupon.create({
    name,
    createdBy,
    expireAt,
    discount: req.body.discount,
  });
  return res.json({ sucess: true, result: coupon });
};
export const update = async (req, res, next) => {
  const coupon = await Coupon.findOne({name: req.params.code, expireAt: {$gt: Date.now()}});
  if(!coupon) return next(new Error('Coupon not found or expired'));
  if (req.user.id != coupon.createdBy)
    return next(new Error("Must be the Owner", { cause: 401 }));
  let {expireAt, discount} = req.body;
  expireAt = new Date(expireAt).getTime();
  const newDate =  expireAt > coupon.expireAt ? expireAt : next(new Error("new date should be after the current one", { cause: 400 }));
  const newDiscount = discount? discount : coupon.discount
  coupon.expireAt = newDate
  coupon.discount = newDiscount
  await coupon.save()
  return res.json({sucess: true, message: "updated !!"})
};
export const deleteCoupon = async (req, res, next) => {
    const coupon = await Coupon.findOneAndDelete({ name: req.params.code });
    if (!coupon) return next(new Error("Coupon not found"));
    if (req.user.id != coupon.createdBy)
      return next(new Error("Must be the Owner", { cause: 401 }));
    return res.json({sucess: true, message: "deleted !!"})
    
};

export const get = async (req, res, next) => {
  const coupon = await Coupon.find()
  if(!coupon) return next(new Error("Coupon not found"));
  return res.json({ sucess: true, result: coupon});
};

export const getsdfa = async (req, res, next) => {

}