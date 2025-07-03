import express from 'express'
import User from '../models/user.model.js'
import {uuid } from 'uuidv4'

const getHome = (req, res) => {
    res.render('home')
}

const getRegister = (req, res) => {
    res.render('register')
}

const getLogin = (req, res) => {

    res.render('login')
}

const getDashboard = async(req, res) => {
    const userData =  await User.findOne({email : req.session.userId})
    console.log(userData)
    res.render('dashboard', {user : userData })
}


const getEditUser = (req, res) => {
    res.render('userEdit')
}

const postLogin = async(req, res) => {
    let userEmail = req.body.email
    try {
        let user = await User.findOne({email : userEmail});
        if(!user){
            return res.status(404).send("User not found")
        }
        if(user.password === req.body.password){
            console.log(user.email)
            req.session.userId = user.email
            
            console.log(12)
            res.redirect('/dashboard')
        }else{
            res.status(400).send("Invalid Credentials")
        } 
    } catch (error) {
         res.send(`${error.message}`)
    }
}

const postRegister = async(req , res)=>{
    const {name , email , password} = req.body
    const user = await User.findOne({email : email});
    if(user){
        res.status(400).render("register",{message : 'User already exists'})
    }else{
        req.body.isAdmin = false
        req.body.isBlocked = false
        const newUser = await User.create({name , email ,password})

        //TODO give session.userID after registertion
        res.redirect('dashboard')
    }
}

const logout = (req , res)=>{
   console.log(1)
        req.session.destroy((err)=>{
            //TODO
        })
        
    res.redirect('/')
}

const postEditUser = async(req, res) =>{

    try {
        let user =await User.findOneAndUpdate({email : req.session.userId}, req.body, {new: true})
        // let x = req.body
        // console.log(x)
        // let newUser = Object.assign(user, req.body)
        const newUser = await User.find({email : req.session.userId})
        console.log(newUser)
        res.json(user, newUser)
    } catch (error) {
        res.status(400).send('error :' + error.message)
    }

}


export default {
    getHome,
    getRegister,
    getLogin,
    getDashboard,
    getEditUser,
    postLogin,
logout,
postRegister,
postEditUser
}