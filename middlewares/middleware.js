import express from 'express'
import User from '../models/user.model.js'
import utils from '../utils/utils.js'


const AuthMiddleware = async(req, res, next) => {
    
    if (req.session.userId) {
        const user = await User.findOne({email :  req.session.userId})
        if(!user.isBlocked){ 
            next()
        }else{
             delete req.session.userId
            req.flash('error', 'user is blocked')
           
            res.redirect('/login')
        }
    } else {
       
        res.redirect('/login')
    }
}

const authorizeRoles = (...roles) => {
   
    //todo change roles to sessions
    return async (req, res, next) => {
         
        const user = await User.findOne({email : req.session.userId})
        
        if(user.roles.some(role => roles.includes(role))){
            next()
        }else{
            res.send("Not Authorized")
        }
    }
}

const redirectIfAuthenticated = async (req, res, next) => {
    try {
        const user = await User.find({email :req.session.userId})
       
        if (!req.session.userId) {
            next()
        } else {
            
            // todo
            // redirectIfAdmin 
            res.redirect('/dashboard')
        }

    } catch (error) {
        res.send(`Error at redirectIfAuthenticated Middleware ${error.message}`)
    }
}


const nocacheMiddleWare = async(req, res, next) =>{
    // * ADDED BY TECH SUPPORT 
// //TODO do understand that
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next()
}

export default { AuthMiddleware, authorizeRoles, redirectIfAuthenticated ,nocacheMiddleWare}