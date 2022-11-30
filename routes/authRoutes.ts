import { Router } from "express";
import { regUser } from "../controllers/authControllers";
import { logUser } from "../controllers/authControllers";

const router = Router();


router.post("/", <any>regUser);
router.post("/loguser", <any>logUser);

export default router;
