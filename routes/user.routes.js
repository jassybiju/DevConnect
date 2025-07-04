import express from "express"
import userController from '../controllers/user.controllers.js'
import middleware from '../middlewares/middleware.js'
const route = express.Router()


// * get Request
route.get('/',userController.getHome)  //home page
route.get('/register',userController.getRegister) // user register
route.get('/login',middleware.redirectIfAuthenticated,  userController.getLogin)
route.get('/dashboard', middleware.nocacheMiddleWare ,  middleware.AuthMiddleware,middleware.authorizeRoles('user'),middleware.AuthMiddleware,  userController.getDashboard)
route.get('/edit',middleware.roleChanged,middleware.nocacheMiddleWare, middleware.AuthMiddleware, userController.getEditUser)



//* post Request
route.post('/login', userController.postLogin)
route.post('/logout',middleware.AuthMiddleware,userController.logout)
route.post('/register',userController.postRegister)
route.post('/edit', middleware.authorizeRoles('admin','user') , userController.postEditUser)
export default route
