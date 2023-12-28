import mongoose from "mongoose";
import env from "./validateEnv";

const connect = async() =>{
    try{
        await mongoose.connect(env.MONGODB_URL!)
        console.log("Mongodb connected!")
    }catch(error){
        console.log("Mongodb connection failed!", error)
        process.exit(1);
    }
}
export default connect;