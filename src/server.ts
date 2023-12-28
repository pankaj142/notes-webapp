import "dotenv/config";
import express from "express";
import connect from "./utils/dbConnect";
import env from "./utils/validateEnv";

const app = express();

app.get("/", (req,res)=>{
    res.send("hello you");
})

app.listen(env.PORT, async()=>{
    await connect();
    console.log(`Server is running at ${env.PORT}.`)
})