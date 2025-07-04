import express from 'express'
import User from '../models/user.model.js'
import { uuid } from 'uuidv4'

const getHome = (req, res) => {
    res.render('home')
}

const getRegister = (req, res) => {
    res.render('register')
}

const getLogin = (req, res) => {

    res.render('login', { error: req.flash('error'), })
}

const getDashboard = async (req, res) => {
    const userData = await User.findOne({ email: req.session.userId })

    //todo complete
    res.render('dashboard', { user: userData, isAdmin: userData.roles.includes('admin') })
}


const getEditUser = (req, res) => {
    res.render('userEdit', { isAdmin: req.session.roles.includes('admin') })
}

const postLogin = async (req, res) => {
    let userEmail = req.body.email
    try {
        let user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).send("User not found")
        }
        if (user.isValidPassword(req.body.password)) {

            req.session.userId = user.email
            req.session.roles = user.roles

            res.redirect('/dashboard')
        } else {
            res.status(400).send("Invalid Credentials")
        }
    } catch (error) {
        res.send(`${error.message}`)
    }
}

const postRegister = async (req, res) => {
    const { name, email, password } = req.body
    const user = await User.findOne({ email: email });
    if (user) {
        res.status(400).render("register", { message: 'User already exists' })
    } else {
        const newUser = new User({ name, email, password })
        await newUser.save()

        //TODO give session.userID after registertion
        req.session.userId = email
        res.redirect('dashboard')
    }
}

const logout = (req, res) => {

    req.session.destroy((err) => {
        //TODO
        if (err) {

            return res.status(500).send('Could not logo ut')
        }
        res.clearCookie('connect.sid', {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
        })
        res.redirect('/')
    })


}

const postEditUser = async (req, res) => {

    try {
        let user = await User.findOneAndUpdate({ email: req.session.userId }, req.body, { new: true, runValidators: true })
        const newUser = await User.find({ email: req.session.userId })

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