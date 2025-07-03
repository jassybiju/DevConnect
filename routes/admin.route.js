import express from "express"
import middleware from "../middlewares/middleware.js"

const route = express.Router()


route.get('',middleware.authorizeRoles('admin'), (req, res)=>{
    res.render('admin')
})

export default route