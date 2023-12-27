import express from "express";

const app = express();
const PORT = undefined;

app.get("/", (req,res)=>{
    res.send("hello you");
})

app.listen(PORT!, ()=>{
    console.log(`Server is running at ${PORT}.`)
})