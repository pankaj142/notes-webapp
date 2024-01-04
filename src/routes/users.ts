
import { Router } from "express";
import * as UserController from "../controllers/users";

const router = Router();

router.post("/signup", UserController.signUp);

export default router;