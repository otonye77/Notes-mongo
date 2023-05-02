import User from "../../model/userModel";
import { dbConnect, dbDisconnect, dbDropCollection } from "./testUtills";
import { describe, test, beforeAll, afterAll } from "@jest/globals";
import { expect } from "@jest/globals";
import mongoose from "mongoose";
import Note from "../../model/noteModel";

beforeAll(async () => await dbConnect());
afterAll(async () => await dbDisconnect());

describe("User Model Test Suite", () => {
  test("should create a User data successfully", async () => {
    const UserData = {
      userName: "Silas",
      email: "silas@gmail.com",
      password: "12345",
    };

    const newUserData = new User(UserData);
    await newUserData.save();
    expect(newUserData._id).toBeDefined();
    expect(newUserData.userName).toBe(UserData.userName);
    expect(newUserData.email).toBe(UserData.email);
    expect(newUserData.password).toBe(UserData.password);
  });

  test("should fail for User data without email field", async () => {
    const invalidUserData = {
      userName: "Silas",
      password: "12345",
    };

    try {
      const newUserData = new User(invalidUserData);
      await newUserData.save();
    } catch (error) {
      const err = error as mongoose.Error.ValidationError;
      expect(err.errors?.email).toBeDefined();
    }
  });

  test("should fail for User data without username and password fields", async () => {
    const invalidUserData = {
      email: "silas@gmail.com",
    };

    try {
      const newUserData = new User(invalidUserData);
      await newUserData.save();
    } catch (error) {
      const err = error as mongoose.Error.ValidationError;
      expect(err.errors?.userName).toBeDefined();
      expect(err.errors?.password).toBeDefined();
    }
  });
});


describe("Note Model Test Suite", () => {
  test("should create a Note data successfully", async () => {
    const NoteData = {
      userId: new mongoose.Types.ObjectId("643f09f8978e60f5de08fdc8"),
      Title: "The Walking Dead",
      Description: "Silas",
      status: "true",
      datePublished: "1990",
      pageCount: 5,
    };

    const newNoteData = new Note({
      userId: new mongoose.Types.ObjectId(NoteData.userId),
      Title: NoteData.Title,
      Description: NoteData.Description,
      datePublished: NoteData.datePublished,
      status: NoteData.status,
      pageCount: NoteData.pageCount,
    });

    await newNoteData.save();

    expect(newNoteData._id).toBeDefined();
    expect(newNoteData.userId).toEqual(NoteData.userId);
    expect(newNoteData.Title).toEqual(NoteData.Title);
    expect(newNoteData.Description).toEqual(NoteData.Description);
    expect(newNoteData.datePublished).toEqual(NoteData.datePublished);
    expect(newNoteData.pageCount).toEqual(NoteData.pageCount);
  });

  test("should fail for Note data without required fields", async () => {
    const invalidNoteData = {
      userId: new mongoose.Types.ObjectId("643f09f8978e60f5de08fdc8"),
      Title: "The Walking Dead",
      Description: "Silas",
      datePublished: "1990",
      status: "true",
      pageCount: 5,
    };

    try {
      const newNoteData = new Note(invalidNoteData);
      await newNoteData.save();
    } catch (error) {
      const err = error as mongoose.Error.ValidationError;
      expect(err.errors.userId).toBeDefined();
    }
  });

  test("should update a Note successfully", async () => {
    const newNoteData = {
      userId: new mongoose.Types.ObjectId("643f09f8978e60f5de08fdc8"),
      Title: "The Walking Dead",
      Description: "Silas",
      datePublished: "1990",
      status: "true",
      pageCount: 5,
    };
    const createdNote = await Note.create(newNoteData);

    const updatedData = {
      userId: new mongoose.Types.ObjectId("643f09f8978e60f5de08fdc8"),
      Title: "The Walking Dead",
      Description: "Silas",
      datePublished: "1990",
      status: "true",
      pageCount: 5,
    };

    const updatedNote = await Note.findByIdAndUpdate(
      createdNote._id,
      updatedData,
      { new: true }
    );

    expect(updatedNote).not.toBeNull();
    expect(updatedNote?.userId).toEqual(newNoteData.userId);
    expect(updatedNote?.Title).toEqual(newNoteData.Title);
    expect(updatedNote?.Description).toEqual(newNoteData.Description);
    expect(updatedNote?.datePublished).toEqual(newNoteData.datePublished);
    expect(updatedNote?.status).toEqual(newNoteData.status);
    expect(updatedNote?.pageCount).toEqual(newNoteData.pageCount);
  });

  test("should delete a Note successfully", async () => {
    const NoteData = {
      userId: new mongoose.Types.ObjectId("643f09f8978e60f5de08fdc8"),
      Title: "The Walking Dead",
      Description: "Silas",
      datePublished: "1990",
      status: "true",
      pageCount: 5,
    };

    const newNoteData = new Note({
      userId: new mongoose.Types.ObjectId(NoteData.userId),
      Title: NoteData.Title,
      Description: NoteData.Description,
      datePublished: NoteData.datePublished,
      status: NoteData.status,
      pageCount: NoteData.pageCount,
    });

    await newNoteData.save();

    const deleteResult = await Note.deleteOne({ _id: newNoteData._id });

    expect(deleteResult.deletedCount).toEqual(1);
  });
});
