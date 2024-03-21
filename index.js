import dotenv from "dotenv/config";
import connectDB from "./DB/conection.js";
import appRouter from "./src/modules/app.router.js";
import express  from 'express'
const app = express()
// app.use(express.json())
const port = 5000
appRouter(app, express)
connectDB()
app.listen(port, () => console.log(`Example app listening on port ${port}!`))