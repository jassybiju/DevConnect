import express from "express"
import User from "../models/user.model.js"

const getAdminDashboard = async (req, res) => {
    try {

        let users
        if (req.query.search) {
            users = await User.find({
                $or: [
                    { name: { $regex: req.query.search, $options: 'i' } },
                    { email: { $regex: req.query.search, $options: 'i' } }
                ]
            })
        }
        else {
            users = await User.find({})
        }


        res.render('admin', { isAdmin: true, users: users })
    } catch (err) {

    }

}

const addUser = async (req, res) => {
    try {

        const user = await User.findOne({ email: req.body.email })

        if (user) return res.send('User Already Exists');
        const { name, email, password } = req.body
        const newUser = new User({ name, email, password })
        await newUser.save()
        res.redirect('/admin')
    } catch (error) {
        res.send(`Error : ${error.message}`)
    }
}

const blockUser = async (req, res) => {
    try {

        const id = req.params.id;
        const user = await User.findOne({ email: id })
        if (user.isBlocked) {
            user.isBlocked = false
        } else {
            user.isBlocked = true
        }
        await user.save()
        res.redirect('/admin')


    } catch (error) {
        console.log(`Error : ${error.message}`)
        res.send(`Error : error.message`)
    }
}

const getEditUser = async (req, res) => {
    const userId = req.params.id
    try {
        const user = await User.findOne({ email: userId })

        res.render('userEditAdmin', { user: user })
    } catch (error) {
        res.send('ERROR', error.message)
    }
}


const editUser = async (req, res) => {
    const userId = req.params.id
    const { Bio, followers, experience, projects } = req.body
    try {

        const user = await User.findOne({ email: userId })
        user.Bio = Bio
        user.followers = followers
        user.experience = experience
        user.projects = projects
        await user.save()
        res.redirect('/admin')
    } catch (error) {
        res.send(`Error : ${error}`)
    }
}

const makeAdmin = async (req, res) => {
    const userId = req.params.id
    try {
        const user = await User.findOne({ email: userId })
        if (user.roles.includes('admin')) {
            user.roles.splice(user.roles.indexOf('array'), 1)
            console.log(user.roles)
        } else {
            user.roles.push('admin')
        }
        await user.save()
        
        
        res.redirect('/admin')
    } catch (error) {

    }
}

export default {
    getAdminDashboard,
    addUser,
    blockUser,
    getEditUser,
    editUser,
    makeAdmin

}