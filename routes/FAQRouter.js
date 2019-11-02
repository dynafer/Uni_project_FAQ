
'use strict'

const Router = require('koa-router')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const router = new Router()

var FAQController = require('../controllers/FAQController')

router.get('/list', FAQController.questionList)
router.get('/writeQuestion', FAQController.newQuestionForm)
router.post('/writeQuestion', koaBody, FAQController.newQuestion)
router.get('/faq/:id([0-9]{1,})', FAQController.detailsQuestion)
router.get('/FullImage/:id([0-9]{1,})', FAQController.fullImage)
router.post('/faq/:id([0-9]{1,})', koaBody, FAQController.newAnswer)
router.get('/faq/:id([0-9]{1,})/:answerid([0-9]{1,})/:flagtype([0-9]{1,})', FAQController.flagAnswer)

module.exports = router