const Router = require('express')
const router = new Router()
const userController = require('../controllers/user.controller')
const registerValidator = require('../validations/auth')
const checkAuth = require('../utils/checkAuth.js');

router.post('/auth/register', registerValidator, userController.registerUser)
router.post('/auth/login', registerValidator, userController.loginUser)
router.get('/auth/me', checkAuth, userController.getMeUser)
router.get('/users', userController.getUsers)
router.get('/user/:id', userController.getOneUser)
router.put('/user/:id', userController.updateUser)
router.delete('/user/:id', userController.deleteUser)

module.exports = router