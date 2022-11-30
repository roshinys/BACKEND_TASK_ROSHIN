"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const Todo_1 = __importDefault(require("./model/Todo"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const redis = __importStar(require("redis"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const fetchRoutes_1 = __importDefault(require("./routes/fetchRoutes"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
const port = process.env.PORT || 5000;
const mongoUrl = process.env.MONGO_URL;
const privatekey = process.env.PRIVATEKEY;
const jwt = jsonwebtoken_1.default;
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
const redisClient = redis.createClient();
// console.log(redisClient);
// {
//   socket: {
//     host: "apn1-brave-adder-33713.upstash.io",
//     port: 33713,
//   },
//   password: "69b6358deaf14b44a0f44fbdb31adf8b",
// }
// app.set("redisclient", redisClient);
io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    socket.on("new-todo", (result) => __awaiter(void 0, void 0, void 0, function* () {
        yield redisClient.connect();
        const token = result.token;
        const todo = result.todo;
        const user = jwt.verify(token, privatekey);
        const userId = user._id;
        const data = `${userId}:${todo}`;
        redisClient.rPush("BACKEND_TASK_ROSHIN", data);
        socket.emit("added-new-todo", { todo });
        const redisTodos = yield redisClient.lRange("BACKEND_TASK_ROSHIN", 0, -1);
        if (redisTodos.length >= 50) {
            redisTodos.forEach((x) => __awaiter(void 0, void 0, void 0, function* () {
                const userTodo = x.split(":");
                const userId = userTodo[0];
                const todo = userTodo[1];
                const newtodo = yield Todo_1.default.create({
                    todo: todo,
                    userId: userId,
                });
            }));
            yield redisClient.flushAll();
        }
        yield redisClient.disconnect();
    }));
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
}));
app.use("/", authRoutes_1.default);
app.use("/fetchAll", fetchRoutes_1.default);
mongoose_1.default
    .connect(mongoUrl)
    .then(() => {
    console.log("connected to db");
    server.listen(port, () => {
        console.log("server started port 5000");
    });
})
    .catch((err) => {
    console.log(err);
});
