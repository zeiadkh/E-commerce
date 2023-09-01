import Cart from "../../../DB/models/cart.model.js";
import Product from "../../../DB/models/product.model.js";

export const create = async (req, res, next) => {
  const { pId, quantity } = req.body;
  const product = await Product.findOne({ _id: pId });
  if (!product) return next(new Error("Product not exist"));
  if (product.availableItems < quantity)
    return next(new Error("This Quantity not available"));
  const existingProduct = await Cart.findOne({ "products.productId": pId });
  if (!existingProduct) {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $push: { products: { productId: pId, quantity } } },
      { new: true }
    );
    return res.status(201).json({ success: true, result: cart });
  } else {
    const existedCart = await Cart.findOne({ "products.productId": pId });
    let message = ''
    existedCart.products.forEach((item) => {
      if (item.productId == pId) {
        if (item.quantity + quantity > product.availableItems){
          message= "no enough quanity"
        }
        else{
          message = "ok"
          return item.quantity += quantity;
        }
      }
    });
    await existedCart.save();
    return res.json({ success: true, message ,result: existedCart });
  }
};

export const update = async (req, res, next) => {
  const { pId, quantity } = req.body;
  if (!quantity)
    return res.json({ success: false, message: "no thing to update" });
  const product = await Product.findOne({ _id: pId });
  if (product.availableItems < quantity)
    return next(new Error("This Quantity not available"));
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id, "products.productId": pId },
    { $set: { "products.$.quantity": quantity } },
    { new: true }
  );
  if (!cart) return next(new Error("This Product not found"));
  return res.json({
    success: true,
    message: "quantity updated",
    result: cart,
  });

};

export const get = async(req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id});
  if(!cart) return next(new Error("Product not found"));
  return res.json({ success: true, result: cart})
}

export const clearCart = async(req, res, next) => {
  const cart = await Cart.findOneAndUpdate({ user: req.user._id}, {$set: {products: []}}, {new: true})
  if(!cart) return next(new Error("your are not authroized", {cause: 401}));
  return res.json({success: true, message: "products removed" ,result: cart})
}

export const deleteProduct = async(req, res, next) =>{
  const cart = await Cart.findOneAndUpdate({ user: req.user._id}, {$pull: {products: {productId: req.params.pId}}}, {new: tru})
  if(!cart) return next(new Error("product not found"), {cause: 404})
  return res.json({success: true, message: "product deleted!", result: cart})
}