const express = require('express')
const usersControllers = require('../controllers/users')
const userRouter = express.Router()

userRouter.get('/', usersControllers.getAllUsers)
userRouter.get('/:id', usersControllers.getUserById)
userRouter.post('/', usersControllers.createUser)
userRouter.put('/:id', usersControllers.updateUser)
userRouter.delete('/:id', usersControllers.deleteUser)

module.exports = userRouter