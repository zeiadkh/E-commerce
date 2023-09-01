import Cart from "../../../DB/models/cart.model.js";
import Coupon from "../../../DB/models/coupon.model.js";
import Order from "../../../DB/models/order.model.js";
import Product from "../../../DB/models/product.model.js";
import { createInvoice } from "../../utils/createPdfInvoice.js";
import { fileURLToPath } from "url";
import path from "path";
import cloudinary from "cloudinary";
import { clearCart, updateStock } from "./order.sevice.js";
import catchError from "../../utils/catchError.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { unlink } from 'node:fs/promises';
import Stripe from "stripe";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const create = async (req, res, next) => {

  let price =0 ;
  const getProducts = [];
  const userId = req.user._id;
  const cart = await Cart.findOne({ user: userId });
  let fullCoupon;

  const { coupon, address, phone, payment } = req.body;
  // check coupon
  if (coupon) {
    fullCoupon = await Coupon.findOne({
      name: coupon,
      expireAt: { $gt: Date.now() },
    });
    if (!fullCoupon) return next(new Error("Coupon not available"));
  }

  // get products from cart
  if (cart.products.length < 1)
    return next(new Error("No products yet to order"));

  for (let product of cart.products) {
    const fullProduct = await Product.findById(product.productId)
    const productObj = {
      productId: fullProduct._id,
      quantity: product.quantity,
      name: fullProduct.name,
      price: fullProduct.price,
      afterDiscount: fullProduct.finalPrice * product.quantity,
    };
    if (fullProduct.availableItems < product.quantity)
      return next(
        new Error(`there is only ${fullProduct.availableItems} avilable`)
      );
    price += productObj.afterDiscount;
    getProducts.push(productObj);
  }
  // create order
  const order = await Order.create({
    address,
    price,
    phone,
    user: userId,
    products: getProducts,
    coupon: {
      name: fullCoupon?.name,
      discount: fullCoupon?.discount || 0,
      id: fullCoupon?._id || 0,
    },
  ...(payment && {payment})
  });

  // generate invoice
  const pdfPath = path.join(
    __dirname,
    `./../../../tempInvoices/${order._id}.pdf`
  );

  const invoice = {
    shipping: {
      name: req.user.userName,
      address: address,
    },
    items: order.products,
    totalWithDiscount: order.price,
    invoice_nr: order._id,
    finalPrice: order.finalPrice,
  };

  // invoice upload
  createInvoice(invoice, pdfPath);
  const { secure_url, public_id } = await cloudinary.v2.uploader.upload(
    pdfPath,
    { folder: `${process.env.CLOUD_FOLDER}/order/${userId}/invoices` }
  );

  order.invoice.url = secure_url;
  order.invoice.id = public_id;
  await order.save();
  
  // delete tempinvoice
try {
  await unlink(pdfPath);
  // console.log('successfully deleted /tmp/hello');
} catch (error) {
  console.error('there was an error:', error.message);
}

catchError(updateStock(order.products, true));

//send mail
sendEmail({
  to: req.user.email,
  subject: `Order ${order._id}`,
  attachments: [{path: secure_url, contentType: 'application/pdf'}],
});

// payment
if(order.payment == "visa"){
  const stripe = new Stripe(process.env.STRIPE_KEY);
  let getCoupon;
  if(order.coupon.name){
    getCoupon = await stripe.coupons.create({
      percent_off: order.coupon.discount,
      duration: "once"
    })
  }
  
  const lineItems = [];
  
  for (let product of order.products) {
    const productData = await Product.findById(product.productId);
    const lineItem = {
      price_data: {
        currency: "EGP",
        product_data: {
          name: productData.name,
          images: [productData.defaultImg.url]
        },
        unit_amount: product.price * 100,
      },
      quantity: product.quantity,
    };
    
    lineItems.push(lineItem);
  }
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: "http://127.0.0.1:5500/html/paymentSuccess.html",
    cancel_url: "http://127.0.0.1:5500/html/paymentCancel.html",
    line_items: lineItems,
    ...(getCoupon && {discounts: [{coupon: getCoupon.id}]})
  });
  if(session) {
    catchError(clearCart(userId));
    return res.json({success: true, result: session.url})
  }
  }
  return res.json({
    success: true,
    message: "Order Created Succesfully🥳, Cash On Delivery.",
    result: order,
  });
};


export const cancelOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);
  if(!order) return next(new Error("order not found"));
  if(["shipped", "delivered", "refunded", "canceled"].includes(order.status)) return next(new Error("can't cancel this order!"))
  order.status = 'canceled';
  await order.save()
  updateStock(order.products, false)
  return res.json({success: true, message:"order cancelled", result: order})
}