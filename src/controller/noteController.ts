import express, { Application, Request, Response, NextFunction } from "express";
import Note from "../model/noteModel";
import { verify } from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET as string;

interface NoteObj {
  Title: string;
  Description: string;
  datePublished: string;
  status: string;
  pageCount: number;
  noteId: number;
}

export const getAddNote = (req: Request, res: Response, next: NextFunction) => {
  res.render("note/edit-note", {
    docTitle: "Add it!",
    path: "/add-note",
    editing: false,
  });
};

export const getNotes = async (req: Request, res: Response) => {
  try {
    const cookie = req.cookies["jwt"];
    verify(cookie, secret, async (err: any, data: any) => {
      const Id = data;
      let page: number = +(req.query.page || 1);
      const limit: number = +(req.query.limit || 100);
      const skip = (page - 1) * limit;
      let query = Note.find({}).sort({ createdAt: -1 });
      query = query.skip(skip).limit(limit);

      const noOfDocument = await Note.countDocuments();

      let noOfPages = Math.ceil(noOfDocument / limit);

      const nextPage = () => {
        if (page < noOfPages) {
          page++;
          return page;
        } else if (page >= noOfPages) {
          return 1;
        }
      };
      let x = page;
      const prevPage = () => {
        page = x;
        console.log(">>", page);

        if (page > 1) {
          page--;
          return page;
        } else if (page < 2) {
          return 1;
        }
      };

      if (req.query.page) {
        if (skip > noOfDocument) alert("Page does not exist");
      }

      const notes = await query;

      return res.render("note/index", {
        prods: notes,
        docTitle: "Library",
        path: "/notess",
        limit: 5,
        nextPage: nextPage,
        prevPage: prevPage,
      });
    });
  } catch (error) {
    console.log("ERROR", error);
  }
};

export const getNote = async (req: Request, res: Response) => {
  try {
    const noteID: string = req.params.bookId;
    console.log("bookID", noteID);
    const note = await Note.findById(noteID);
    res.render("note/detail", {
      note,
      docTitle: "Note Details",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "Note not found",
    });
  }
};

export const postAddNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    Title,
    Description,
    datePublished,
    status,
    pageCount
  } = req.body;
  const cookie = req.cookies["jwt"];
  verify(cookie, secret, async (err: any, data: any) => {
    const Id = data.id;
    const note = await Note.create({
      Title,
      Description,
      datePublished,
      status,
      pageCount,
      UserId: Id,
    });
    note.save();
    res.redirect("/notes?page=1&limit=5");
  });
};

export const getEditNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const editMode = req.query.edit;

    if (!editMode) {
      return res.redirect("/notess");
    }
    const noteID = req.params.noteId;

    const book = await Note.findById(noteID);
    res.render("note/edit-note", {
      docTitle: "Edit it!",
      path: "/edit-note",
      editing: editMode,
      book,
      activeAddProduct: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "Cannot get",
    });
  }
};

export const postEditNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const note = await Note.findByIdAndUpdate(req.body.noteID, req.body, {
      new: true,
    });
    // res.status(200).json({
    //   status: "success",
    //   data: {
    //     book,
    //   },
    // });
    res.redirect("/notes?page=1&limit=5");
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

export const postDeleteNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const noteID = req.body.noteId;
  await Note.findByIdAndDelete(noteID);
  res.redirect("/notes");
};
