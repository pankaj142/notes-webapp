import { RequestHandler } from "express";
import NoteModel from "../models/note"
import createHttpError from "http-errors";
import mongoose from "mongoose";

export const getNotes : RequestHandler = async(req, res, next)=>{
    try{
        const notes = await NoteModel.find().exec();
        res.status(200).json(notes);
    }catch(error){  
        next(error)
    }
}

export const getNote : RequestHandler = async(req, res, next)=>{
    const noteId = req.params.id;
    try {
        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400, "Invalid Note id!")
        }
        //check if note id is valid mongodb id or not
        const note = await NoteModel.findById(noteId).exec();
        if(!note){
            throw createHttpError(404, "Note not found!")
        }
        res.status(200).json(note);
    }catch(error){
        next(error);
    }
}

interface CreatNoteBody {
    title? : string,
    text? : string
}

export const createNote : RequestHandler<unknown, unknown, CreatNoteBody, unknown > = async(req,res, next) => {
    const title = req.body.title;
    const text = req.body.text;
    try{
        if(!title){
            throw createHttpError(400, "Note must have a title.")
        }
        const newNote = await NoteModel.create({
            title : title,
            text : text
        });
        res.status(201).json(newNote);
    }catch(error){
        next(error);
    }
}

interface UpdateNoteBody {
    title? : string,
    text? : string
}

interface UpdateNoteParams {
    id : string
}

export const updateNote : RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody, unknown> = async(req, res, next) => {
    const noteId = req.params.id;
    const newTitle = req.body.title;
    const newText = req.body.text;
    try{
        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(404, "Invalid note id!")
        }
        if(!newTitle){
            throw createHttpError(400, "Note must have title!")
        }
        
        const note = await NoteModel.findById(noteId).exec();
        if(!note){
            throw createHttpError(404, "Note not found!")
        }

        note.title = newTitle;
        note.text = newText;

        await note.save();

        res.status(200).json({
            message : "Note updated",
            id : noteId
        });
    }catch(error){
        next(error);
    }
}

export const deleteNote : RequestHandler = async(req, res, next) => {
    const noteId = req.params.id;
    try{
        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400, "Invalid Note id!")
        }

        const deletedNote = await NoteModel.findByIdAndDelete({_id : noteId});
        if(!deletedNote){
            throw createHttpError(404, "Note not found!")
        }
        res.status(204).json({
            message : "Note deleted",
            id : noteId
        })
    }catch(error){
        next(error)
    }
}