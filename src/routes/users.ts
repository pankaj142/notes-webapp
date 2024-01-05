
import { Router } from "express";
import * as UserController from "../controllers/users";

const router = Router();

router.get("/", UserController.getAuthenicateUser);
router.post("/signup", UserController.signUp);
router.post("/login", UserController.login)
router.post("/logout", UserController.logout)

export default router;