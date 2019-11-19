/*eslint linebreak-style: ["error", "windows"]*/
'use strict'

const Router = require('koa-router')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const router = new Router()

const UserController = require('../controllers/UserController')

router.get('/', UserController.home)
router.get('/register', UserController.registerForm)
router.post('/register', koaBody, UserController.register)
router.get('/login', UserController.loginForm)
router.post('/login', UserController.login)
router.get('/logout', UserController.logout)

module.exports = router
