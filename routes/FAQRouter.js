
'use strict'

const Router = require('koa-router')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const router = new Router()

var FAQController = require('../controllers/FAQController')

router.get('/list', FAQController.questionList)
module.exports = router