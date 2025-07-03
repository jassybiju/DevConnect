import User from "../models/user.model.js"

const isAdmin = async(userId)=>{
    const user = User.findOne({email : userId})
    if(!user) { throw new Error(`User not found`)}
    if(user.isAdmin){
        return true
    }else{
        return false
    }
}

export default {isAdmin}