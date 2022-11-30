import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { fetchTodo } from "../controllers/fetchControllers";

const router = Router();

router.get("/", <any>authenticate, <any>fetchTodo);

export default router;
