const express = require('express')
const { createUser, editUser, getAllUsers, deleteUser, login, verifyUser, getMe, requestOTP } = require('../controllers/user.controller')
const router = express.Router()


router.post('/register', createUser)
router.patch('/edituser/:id', editUser)
router.get('/getUsers', getAllUsers)
router.delete('/deleteuser/:id', deleteUser)
router.post('/login', login)
router.post('/request-otp',requestOTP)
router.get('/me', verifyUser, getMe)

module.exports=router
