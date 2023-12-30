import { Router } from "express";
import * as NotesController from "../controllers/notes";

const router = Router()

router.get("/", NotesController.getNotes);
router.post("/", NotesController.createNote);
router.get("/:id", NotesController.getNote)
router.patch("/:id", NotesController.updateNote)
router.delete("/:id", NotesController.deleteNote)

export default router;