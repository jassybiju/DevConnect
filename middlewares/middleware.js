import express from 'express'
import User from '../models/user.model.js'
import utils from '../utils/utils.js'


const AuthMiddleware = (req, res, next) => {
    console.log(auth)
    if (req.session.userId) {
        next()
    } else {
        res.redirect('/login')
    }
}

const authorizeRoles = (...roles) => {
    //todo change roles to sessions
    return async (req, res, next) => {
        const user = await User.find({email : req.session.userId})

        if(roles.includes(user.roles)){
            next()
        }else{
            res.send("Not Authorized")
        }
    }
}

const redirectIfAuthenticated = async (req, res, next) => {
    try {
        if (!req.session.userId) {
            next()
        } else {
            // todo
            // redirectIfAdmin
        }

    } catch (error) {
        res.send(`Error at redirectIfAuthenticated Middleware ${error.message}`)
    }
}


export default { AuthMiddleware, authorizeRoles, redirectIfAuthenticated }