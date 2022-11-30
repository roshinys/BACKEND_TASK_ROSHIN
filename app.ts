import { config } from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import Todo from "./model/Todo";
import jsonwebtoken from "jsonwebtoken";
import http from "http";
import { Server } from "socket.io";
import * as redis from "redis";
import authRoutes from "./routes/authRoutes";
import fetchRoutes from "./routes/fetchRoutes";
import { authenticate } from "./middleware/authenticate";

config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const port: number | string = process.env.PORT || 5000;
const mongoUrl: string = process.env.MONGO_URL!;
const privatekey: string = process.env.PRIVATEKEY!;

const jwt = jsonwebtoken;

const server = http.createServer(app);
const io = new Server(server);

const redisClient = redis.createClient();

io.on("connection", async (socket) => {
  socket.on("new-todo", async (result) => {
    await redisClient.connect();
    const token = result.token;
    const todo = result.todo;
    const user: any = jwt.verify(token, privatekey);
    const userId = user._id;
    const data = `${userId}:${todo}`;
    redisClient.rPush("BACKEND_TASK_ROSHIN", data);
    socket.emit("added-new-todo", { todo });
    const redisTodos = await redisClient.lRange("BACKEND_TASK_ROSHIN", 0, -1);
    if (redisTodos.length >= 50) {
      redisTodos.forEach(async (x: string) => {
        const userTodo = x.split(":");
        const userId = userTodo[0];
        const todo = userTodo[1];
        const newtodo = await Todo.create({
          todo: todo,
          userId: userId,
        });
      });
      await redisClient.flushAll();
    }
    await redisClient.disconnect();
  });
  // //get all todos
  // socket.on("get-todos", async (token: any) => {
  //   await redisClient.connect();
  //   const user: any = jwt.verify(token.token, privatekey);
  //   const userId = user._id;
  //   const allTodos = await Todo.find({ userId: userId });
  //   const todosList = allTodos.map((todo) => {
  //     return todo.todo;
  //   });
  //   const redisTodos = await redisClient.lRange("BACKEND_TASK_ROSHIN", 0, -1);
  //   redisTodos.forEach((x) => {
  //     const userTodo = x.split(":");
  //     const redisUserId = userTodo[0];
  //     const redisTodo = userTodo[1];
  //     if (userId == redisUserId) {
  //       todosList.push(redisTodo);
  //     }
  //   });
  //   socket.emit("receive-todos", { todosList });
  //   await redisClient.disconnect();
  // });
});

app.use("/", authRoutes);
app.use("/fetchAll", fetchRoutes);

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("connected to db");
    server.listen(port, () => {
      console.log("server started port 5000");
    });
  })
  .catch((err: any) => {
    console.log(err);
  });
