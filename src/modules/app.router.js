import userRouter from "./user/user.router.js";
import catRouter from "./category/category.router.js";
import subCatRouter from "./subcategory/subCat.router.js";
import brandRouter from "./brand/brand.router.js";
import productRouter from "./product/product.router.js";
import couponRouter from "./coupon/coupon.router.js";
import cartRouter from "./cart/cart.router.js";
import orderRouter from "./order/order.router.js";
import morgan from "morgan";
import cors from 'cors'
const appRouter = (app, express) => {
  app.use(cors())
  app.use((req, res, next) => {
    if (req.originalUrl === "/order/webhook") return next();
    express.json()(req, res, next);
  })
  // app.use(express.json())
  process.env.MODE ? app.use(morgan("dev")) : "";
  
  // const whiteList = ["http://127.0.0.1:8080", "https://76.76.21.142"];
  // app.use((req, res, next) => {
  //   if(req.originalUrl.includes("user/cofirmEmail")) {
  //     res.setHeader("Access-Control-Allow-Origin", "*");
  //     res.setHeader("Access-Control-Allow-Methods", "GET");
  //     return next()
  //   }
  //   // if (!(whiteList.includes(req.header("origin"))))
  //   //   return next(new Error("Access denied", { cause: 401 }));
  //   res.setHeader("Access-Control-Allow-Origin", "*");
  //   res.setHeader("Access-Control-Allow-Headers", "*");
  //   res.setHeader("Access-Control-Allow-Methods", "*");
  //   res.setHeader("Access-Control-Allow-Private-Network", true);
  //   return next();
  // });

  app.use("/user", userRouter);
  app.use("/category", catRouter);
  app.use("/subcategory", subCatRouter);
  app.use("/brand", brandRouter);
  app.use("/product", productRouter);
  app.use("/coupon", couponRouter);
  app.use("/cart", cartRouter);
  app.use("/order", orderRouter);

  app.all("*", (req, res, next) =>
    next(new Error("page not found", { cause: 404 }))
  );

  app.use((err, req, res, next) =>
    res.status(err.cause || 500).json({
      sucess: false,
      message: err.message,
      ...(process.env.mode == "DEV" ? { stack: err.stack } : ""),
    })
  );
};

export default appRouter;
