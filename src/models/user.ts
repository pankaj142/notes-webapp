import  { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema({
    username : {
        type : String,
        unique : true,
        require : true
    },
    email : {
        type : String,
        require : true,
        unique : true,
        select : false // to make sure by default email is not being send when we retrive from DB, if we need email field, then we need to explicitely mention this field while retrieving user data
    },
    password : {
        type : String,
        require : true, 
        select : false
    }
}, {
    timestamps : true
})

type User = InferSchemaType<typeof userSchema>

export default model<User>("User",userSchema);