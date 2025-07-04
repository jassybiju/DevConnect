import mongoose from "mongoose";
import bcrypt from 'bcrypt'


const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        match : [/^[a-zA-Z\s.'-]{2,50}$/, 'Please enter a valid name'],
    },
    email :{
        type : String ,
        required : true,
        unique : true,
        match : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/, 'Please enter a valid email address'],
    },
    password : {
        type : String,
        required : true,
    },
    isBlocked : {
        type  : Boolean,
        required : true,
        default :false
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

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();

    try{
        const salt =   bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    }catch(err){
        console.log(`Error : ${err.message}`)
    }
})

userSchema.methods.isValidPassword = async function(password){
    try {
        return await bcrypt.compare(password , this.password)
    } catch (error) {
        throw new Error('Password comparison failed')
    }
}


const User = mongoose.model('User', userSchema)

export default User