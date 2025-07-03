import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    email :{
        type : String ,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
    roles : {
        type : Array,
        required : true,
        default : ['user']
    },
    Bio : {
        type : String,
    },
    followers : {
        type : Number,
    },
    experience : {
        type : Number,
    },
    projects : {
        type : Number
    }

})

const User = mongoose.model('User', userSchema)

export default User