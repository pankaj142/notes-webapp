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
            throw createHttpError(409, "Username already taken. Please choose different one or login instead.")
        }

        const existingEmail = await UserModel.findOne({email}).exec();
        if(existingEmail){
            throw createHttpError(409, "A user with this emailId already exists. Please login instead.")
        }

        const passwordHashed = await bcrypt.hash(password, 10);
        const user = await UserModel.create({username, email, password : passwordHashed});

        req.session.userId = user._id;
        res.status(201).json(user);
    }catch(error){
        next(error);
    }
}

interface LoginBody {
    username? : string;
    password? : string;
}

export const login : RequestHandler<unknown, unknown,LoginBody, unknown> = async(req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    try{
        if(!username || !password){
            throw createHttpError(400, "Required fields are missing.");
        }
        const user = await UserModel.findOne({username}).select("+email +password").exec();

        if(!user){
            throw createHttpError(401, "Invalid credentials!")
        }
        const userPassword = user.password ?? "";
        const passwordMatch =  bcrypt.compare(password, userPassword)

        if(!passwordMatch){
            throw createHttpError(401, "Invalid credentials!")
        }

        req.session.userId = user._id;
        res.status(201).json(user)
    }catch(error){
        next(error);
    }
}

export const getAuthenicateUser : RequestHandler = async(req,res, next) => {
    const userId = req.session.userId;

    try{
        if(!userId){
            throw createHttpError(401, "User not authenticated!")
        }

        const user = await UserModel.findById(userId).select("+email").exec();

        if(!user){
            throw createHttpError(404, "User not found")
        }

        res.status(201).json(user);

    }catch(error){
        next(error);
    }
}

export const logout : RequestHandler = (req,res, next) => {
    req.session.destroy((err)=>{
        if(err){
            next(err);
        }else{
            res.sendStatus(200);
        }
    });
}