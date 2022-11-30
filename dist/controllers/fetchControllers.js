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
exports.fetchTodo = void 0;
const redis = __importStar(require("redis"));
const Todo_1 = __importDefault(require("../model/Todo"));
const redisClient = redis.createClient();
const fetchTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient.connect();
    const user = req.user;
    console.log(user);
    const userId = user._id;
    const allTodos = yield Todo_1.default.find({ userId: userId });
    const todosList = allTodos.map((todo) => {
        return todo.todo;
    });
    const redisTodos = yield redisClient.lRange("BACKEND_TASK_ROSHIN", 0, -1);
    redisTodos.forEach((x) => {
        const userTodo = x.split(":");
        const redisUserId = userTodo[0];
        const redisTodo = userTodo[1];
        if (userId == redisUserId) {
            todosList.push(redisTodo);
        }
    });
    yield redisClient.disconnect();
    res.json({ msg: "fetch all", todosList });
});
exports.fetchTodo = fetchTodo;
