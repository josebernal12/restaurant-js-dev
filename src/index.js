import express from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import { rateLimit } from "express-rate-limit";
import { Server, Socket } from "socket.io";
import { connectDB } from "./database/database.js";
import productRouter from "./router/product.js";
import rolRouter from "./router/rol.js";
import tableRouter from "./router/table.js";
import ticketRouter from "./router/ticket.js";
import billRouter from "./router/bill.js";
import activitiesRouter from "./router/activities.js";
import noteRouter from "./router/note.js";
import targetRouter from "./router/target.js";
import inventaryRouter from "./router/inventary.js";
import promotionRouter from "./router/promotion.js";
import categoryRouter from "./router/category.js";
import questionsRouter from "./router/questions.js";
import suppliersRouter from "./router/suppliers.js";
import companyRouter from "./router/company.js";
import currencyRouter from "./router/currency.js";
import methodOfPaymentRouter from "./router/methodOfPayment.js";
import payRouter from "./router/pay.js";
import authRouter from "./router/authRouter.js";
import userRouter from "./router/userRouter.js";
import clientRouter from "./router/client.js";
// import printRouter from "./router/print.js";
import { checkJwt } from "./middleware/permission.js";
import checkTrialPeriod from "./middleware/checkTrialPeriod.js";

const app = express();
const port = process.env.PORT || 8080;
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL1,
    process.env.FRONTEND_URL2,
    process.env.FRONTEND_PRODUCTION,
  ],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("combined"));
app.use(compression());

// const limiter = rateLimit({
// 	windowMs: 15 * 60 * 1000, // 15 minutes
// 	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
// 	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
// 	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
// 	// store: ... , // Redis, Memcached, etc. See below.
// })

// // Apply the rate limiting middleware to all requests.
// app.use(limiter)
app.use("/api/auth", authRouter);
// app.use('/api/print', printRouter)
app.use(checkJwt);
app.use("/api/pay", payRouter);
app.use(checkTrialPeriod);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/rol", rolRouter);
app.use("/api/table", tableRouter);
app.use("/api/ticket", ticketRouter);
app.use("/api/bill", billRouter);
app.use("/api/activities", activitiesRouter);
app.use("/api/note", noteRouter);
app.use("/api/target", targetRouter);
app.use("/api/inventory", inventaryRouter);
app.use("/api/promotion", promotionRouter);
app.use("/api/category", categoryRouter);
app.use("/api/questions", questionsRouter);
app.use("/api/supplier", suppliersRouter);
app.use("/api/company", companyRouter);
app.use("/api/currency", currencyRouter);
app.use("/api/methodOfPayment", methodOfPaymentRouter);
app.use("/api/client", clientRouter);
const server = app.listen(port, () => {
  connectDB();

  console.log("Connection has been established successfully.");
  console.log(`server listening port ${port}`);
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: [
      process.env.FRONTEND_URL1,
      process.env.FRONTEND_URL2,
      process.env.FRONTEND_URL3,
      process.env.FRONTEND_URL4,
      process.env.FRONTEND_PRODUCTION,
    ],
  },
});

io.on("connection", (socket) => {
  console.log("conectacdo a socket io");

  socket.on("crear ticket", (ticket) => {
    io.emit("ticket creado", ticket);
  });
  socket.on("actualizar ticket", (ticket) => {
    io.emit("ticket actualizado", ticket);
  });
  socket.on("eliminar ticket", (ticket) => {
    io.emit("ticket eliminado", ticket);
  });
  socket.on("recibir ticket", (ticket) => {
    io.emit("ticket recibido", ticket);
  });
  socket.on("finalizar ticket", (ticket) => {
    io.emit("ticket finalizado", ticket);
  });
  socket.on("crear nota", (nota) => {
    io.emit("nota creada", nota);
  });
  socket.on("actualizar nota", (nota) => {
    io.emit("nota actualizada", nota);
  });
  socket.on("eliminar nota", (nota) => {
    io.emit("nota eliminada", nota);
  });
  socket.on("borrar mesa", (mesa) => {
    io.emit("mesa eliminada", mesa);
  });
  socket.on("comprar ticket", (ticket) => {
    io.emit("ticket comprado", ticket);
  });
  socket.on("obtener ticket", (ticket) => {
    io.emit("ticket obtenido", ticket);
  });
});
