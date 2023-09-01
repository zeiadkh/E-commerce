import Token from "../../DB/models/token.model.js";
import User from "../../DB/models/user.model.js";
import jwt from "jsonwebtoken";
import catchError from "../utils/catchError.js"
export const isAuthenticated = catchError(async (req, res, next) => {
  let { token } = req.headers;
  if(!token) return next(new Error("token is required"));
  if (!token.startsWith(process.env.bearer))
    return next(new Error("wrong token or bearer"));
  token = token.split(process.env.bearer)[1];
  let payload = jwt.verify(token, process.env.secret_key);
  if (!payload) return next(new Error("invalid token"));
  const savedToken = await Token.findOne({ token });
  if (!savedToken) return next(new Error("Token not found"));
  if (!savedToken.isValid) return next(new Error("Token not valid"));
  const user = await User.findById(payload.id);
  if (!user) return next(new Error("user not found"));
  req.user = user;
  return next();
});
