import app from "./app";
import connect from "./utils/dbConnect";
import env from "./utils/validateEnv";

app.listen(env.PORT, async()=>{
    await connect();
    console.log(`Server is running at ${env.PORT}.`)
})