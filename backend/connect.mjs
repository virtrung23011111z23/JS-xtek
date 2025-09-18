import express from 'express'
import cors from 'cors';
import RoutesOrder from "./dataRoutes/RoutesOrder.js"


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/order",RoutesOrder)
const PORT = process.env.PORT || 5000;
app.listen(process.env.PORT || 5000, process.env.HOST || 'localhost', () => {
  console.log(`Server đang chạy tại http://${process.env.HOST || 'localhost'}:${process.env.PORT || 5000}`);
});