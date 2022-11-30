import { Request, Response } from "express";
import * as redis from "redis";
import Todo from "../model/Todo";

const redisClient = redis.createClient();

export const fetchTodo = async (req: Request, res: Response) => {
  await redisClient.connect();
  const user: any = (<any>req).user;
  console.log(user);
  const userId = user._id;
  const allTodos = await Todo.find({ userId: userId });
  const todosList = allTodos.map((todo) => {
    return todo.todo;
  });

  const redisTodos = await redisClient.lRange("BACKEND_TASK_ROSHIN", 0, -1);
  redisTodos.forEach((x: string) => {
    const userTodo = x.split(":");
    const redisUserId = userTodo[0];
    const redisTodo = userTodo[1];
    if (userId == redisUserId) {
      todosList.push(redisTodo);
    }
  });
  await redisClient.disconnect();
  res.json({ msg: "fetch all", todosList });
};
