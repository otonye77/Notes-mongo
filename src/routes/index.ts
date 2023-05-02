import express, { Application, Request, Response, NextFunction } from "express";
import { auth } from "../middleware/auth";
const router = express.Router();
import {
  getNotes,
  getNote,
  getAddNote,
  postAddNote,
  getEditNote,
  postEditNote,
  postDeleteNote,
} from "../controller/noteController";

// router.get("/dashboard", (req: Request, res: Response, next: NextFunction) => {
//   res.render('book/home')
// });

router.get("/add-note", getAddNote);
router.get("/:noteId", getNote);
router.get("/", auth, getNotes);
router.post("/add-note", postAddNote);
router.get("/edit-book/:noteId", getEditNote);
router.post("/edit-note", postEditNote);
router.post("/delete-note", postDeleteNote);

export default router;
