import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js"
import path from 'path'
import { fileURLToPath } from "url";
import userRouter from "./routes/user.routes.js"
import adminRouter from './routes/admin.route.js'
import session from "express-session";
import MongoStore from "connect-mongo";
import nocache from "nocache";
import middleware from './middlewares/middleware.js'

//* config
dotenv.config()
const app = express();
const PORT = process.env.PORT || 5000

app.use(nocache())

// * getting Dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use((req, res, next)=>{
    res.set('Cache-Control', 'no-store')
    next()
}
)

app.use(session({
    secret : process.env.SESSION_SECRET,
    resave :false,
    saveUninitialized : false,
    store : new MongoStore({
        collectionName : 'session',
        mongoUrl : process.env.MONGO_URI,
        ttl : 1 * 24 * 60 * 60,
        autoRemove : "native"
    })
    // cookie : {secure : true}
}))


//* styles 
app.use('/assets',express.static(__dirname + '/static'))
app.set('view engine', 'ejs')


app.use('/',userRouter) //userRouter
app.use('/admin',adminRouter) //adminRouter





app.listen(PORT , ()=>{
    connectDB()
    console.log(`listening to the port ${PORT}`)
})

