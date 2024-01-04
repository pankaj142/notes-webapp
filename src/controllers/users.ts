import { RequestHandler } from "express";
import UserModel from "../models/user";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";

interface signUpBody { //all fields are optional as we don't know wheather these fields are send from FE or not
    username? : string;
    email? : string;
    password? : string;
}

export const signUp : RequestHandler<unknown, unknown, signUpBody, unknown> = async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    try{
        if(!username || !email || !password){
            throw createHttpError("400", "Required fields are missing!")
        }

        // add more validation on email and password field like similar to frontend validation - if needed

        const existingUsername = await UserModel.findOne({username}).exec();

        if(existingUsername){
            createHttpError(409, "Username already taken. Please choose different one or login instead.")
        }

        const existingEmail = await UserModel.findOne({email}).exec();

        if(existingEmail){
            createHttpError(409, "A user with this emailId already exists. Please login instead.")
        }

        const passwordHashed = await bcrypt.hash(password, 10);

        const user = await UserModel.create({username, email, password : passwordHashed});
        res.status(201).json(user);
    }catch(error){
        next(error);
    }
}
