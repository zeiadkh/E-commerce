import Review from "../../../DB/models/review.model.js";
import Product from "../../../DB/models/product.model.js";


export const create = async (req, res, next) => {
    const {pId, content} = req.body;
    const product = await Product.findById(pId)
    if(!product) return next(new Error("Product not found"));
    const review = Review.create({
        content,
        user: req.user.id,

    })
    product.reviews.push({Id: review.id})
    return res.json({success: true, message: "Your review has beent added", result: product})

}