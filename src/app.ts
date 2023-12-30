import "dotenv/config";
import NotesRoutes from "./routes/notes";
import { NextFunction, Request, Response } from "express";
import  express  from "express";
import morgan from "morgan";
import createHttpError, {isHttpError} from "http-errors";

const app = express();

app.use(morgan("dev"))

app.use(express.json()); // parses the incoming requests with JSON payloads

// routes
app.use("/api/notes", NotesRoutes)

// middlewares

// middleware for handling - wrong route
app.use((req,res, next)=>{
    next(createHttpError(404,"Endpoint does not exist!"))
})

// middleware for error handling 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error : unknown, req: Request, res: Response, next: NextFunction)=>{
    let errorMessage = "An unknown error is occured."
    
    let statusCode = 500;
    if(isHttpError(error)){
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({error : errorMessage})
})

export default app;