import Token from "../../../DB/models/token.model.js";
import User from "../../../DB/models/user.model.js";

export const get = async (req, res, next) => {
    const token = req.headers.token.toString().slice(process.env.BEARER.length);
    const userToken = await Token.findOne({token});
    const user = await User.findById(userToken.user);
    if (!user) return next(new Error("User not found"))
    return res.json({success: true, result: user})
}