import Cart from "../../../DB/models/cart.model.js";
import Product from "../../../DB/models/product.model.js";

export const clearCart = async (userId) =>
  await Cart.findOneAndUpdate({ user: userId }, { products: [] });

export const updateStock = async (products, placed) => {
  if(placed){

    for (const product of products) {
      await Product.findByIdAndUpdate(product.productId, {
        $inc: { availableItems: -product.quantity, soldItems: product.quantity },
      });
    }
  }else{
    for (const product of products) {
      await Product.findByIdAndUpdate(product.productId, {
        $inc: { availableItems: product.quantity, soldItems: -product.quantity },
      });
  }
 };
}
