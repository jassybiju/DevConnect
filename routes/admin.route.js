import express from "express"
import middleware from "../middlewares/middleware.js"
import adminControllers from "../controllers/admin.controllers.js"

const route = express.Router()

route.use(middleware.AuthMiddleware)
route.use(middleware.authorizeRoles('admin'))
route.use(middleware.nocacheMiddleWare)
route.use(middleware.roleChanged)

route.post('/addUser', adminControllers.addUser)
route.get('/block/:id', adminControllers.blockUser )
route.get('/edit/:id', adminControllers.getEditUser )

route.post('/edit/:id', adminControllers.editUser )
route.get('/',adminControllers.getAdminDashboard)

route.get('/tAdmin/:id', adminControllers.makeAdmin)
export default route

