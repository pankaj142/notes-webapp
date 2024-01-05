import "dotenv/config";
import NotesRoutes from "./routes/notes";
import UserRoutes from "./routes/users";
import { NextFunction, Request, Response } from "express";
import  express  from "express";
import morgan from "morgan";
import createHttpError, {isHttpError} from "http-errors";
import session from "express-session";
import env from "./utils/validateEnv";
import MongoStore from "connect-mongo";
  
const app = express();

app.use(morgan("dev"))

app.use(express.json()); // parses the incoming requests with JSON payloads

app.use(session({
    secret : env.SESSION_SECRET,
    resave : false,
    saveUninitialized : false,
    cookie : {
        maxAge : 60 * 60 * 1000 // 1 hr
    },
    rolling : true,
    store : MongoStore.create({
        mongoUrl : env.MONGODB_URL
    })
}))

// routes
app.use("/api/notes", NotesRoutes)
app.use("/api/users", UserRoutes)

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