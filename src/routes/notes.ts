import { Router } from "express";
import * as NotesController from "../controllers/notes";

const router = Router()

router.get("/", NotesController.getNotes);
router.post("/", NotesController.createNote);

export default router;