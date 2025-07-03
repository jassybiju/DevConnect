# 🚀 Express Session-Based App Boilerplate

A starter Node.js project using Express, MongoDB, dotenv, and `express-session` with MongoDB as a session store. Uses EJS as the templating engine.

---

## 📁 Folder Structure

project-root/
│
├── config/
│ └── db.js
│
├── routes/
│ └── route.js
│
├── static/
│ └── assets/ (CSS, JS, images, etc.)
│
├── views/
│ └── *.ejs
│
├── .env
├── server.js
├── package.json
└── README.md

yaml
Copy
Edit

---

## 🛠️ Installation & Setup

### Step 1: Initialize the project

```bash
npm init -y
Step 2: Install dependencies
bash
Copy
Edit
npm install express mongoose dotenv express-session connect-mongo nodemon
⚠️ Use connect-mongo for storing sessions in MongoDB (not session-cookie).

#📜 package.json Setup
##Add the following inside package.json:

"type": "module",
"scripts": {
  "dev": "nodemon server.js"
}
#🌐 Environment Variables
##Create a .env file at the root:

PORT=5000
MONGO_URI=mongodb://localhost:27017/sessiondb
SESSION_SECRET=your_session_secret
🔌 server.js Overview


import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import path from 'path'
import { fileURLToPath } from 'url'
import route from './routes/route.js'
import connectDB from './config/db.js'

// Load environment variables
dotenv.config()

// Connect to DB
connectDB()

// Init express
const app = express()
const port = process.env.PORT || 5000

// Path fix for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
    ttl: 60 * 60, // 1 hour
    autoRemove: 'native'
  })
}))

// Static files
app.use('/assets', express.static(__dirname + '/static'))

// Set view engine
app.set('view engine', 'ejs')

// Use routes
app.use('/', route)

// Listen
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
⚙️ MongoDB Connection (config/db.js)
js
Copy
Edit
import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
✅ Features
ES6 Modules

Express.js Setup

Session management with MongoDB

EJS view rendering

Organized folder structure

Environment-based config

"# DevConnect" 
```

# Error resolving caused due to session 
```bash
const logout = (req , res)=>{
   console.log(1)
        req.session.destroy((err)=>{
            //TODO
            if(err){
                console.log(`Logout error : ${err}`)
                return res.status(500).send('Could not logo ut')
            }
            res.clearCookie('connect.sid',{
                path:'/',
                httpOnly : true,
                sameSite : 'lax',
                secure : false,
            })
            res.redirect('/')
        })
        
    
}

const getDashboard = async(req, res) => {
    const userData =  await User.findOne({email : req.session.userId})
// * ADDED BY TECCH SUPPORT 
// //TODO do understand that
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');

    res.render('dashboard', {user : userData })
}

```