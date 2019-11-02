
'use strict'

const jimp = require('jimp')

// Question Services
var QuestionListService = require('../services/QuestionServices/QuestionListService')
var NewQuestionService = require('../services/QuestionServices/NewQuestionService')
var UploadPictureService = require('../services/QuestionServices/UploadPictureService')
var DetailQuestionService = require('../services/QuestionServices/DetailQuestionService')

// Answer Services
var AnswerListService = require('../services/AnswerServices/AnswerListService')
var NewAnswerService = require('../services/AnswerServices/NewAnswerService')
var FlagAnswerService = require('../services/AnswerServices/FlagAnswerService')
var RateAnswerService = require('../services/AnswerServices/RateAnswerService')

module.exports = {
    questionList: async ctx => {
        try {
            let checkLoggedin = false
            if(ctx.session.authorised !== true) {
                checkLoggedin = false
            } else {
                checkLoggedin = true
            }
            const getList = await QuestionListService.getQuestions({})
            await ctx.render('list', {check: checkLoggedin, list: getList})
        } catch(err) {
            console.log(err)
            await ctx.render('error', {message: err.message})
        }
    },
    newQuestionForm: async ctx => {
        try {
            let checkLoggedin = false
            if(ctx.session.authorised !== true) {
                checkLoggedin = false
            } else {
                checkLoggedin = true
            }
            await ctx.render('writeQuestion', {check: checkLoggedin})
        } catch(err) {
            console.log(err)
            await ctx.render('error', {message: err.message})
        }
    },
    newQuestion: async ctx => {
        try {
            const body = ctx.request.body
            var {path, type, size} = ctx.request.files.image
            if(size !== 0) {
                body.imageBool = 1
                body.imageType = type
            } else {
                body.imageBool = 0
                body.imageType = ""
            }
            body.author = ctx.session.userid
            const checkTrue = await NewQuestionService.newQuestion(body)
            if(checkTrue === true && size !== 0) {
                const getList = (await QuestionListService.getQuestions({}))[0]
                await UploadPictureService.uploadPicture({listid: getList.id, path: path, type: type})
            }
            ctx.redirect(`/list`)
        } catch(err) {
            console.log(err)
            await ctx.render('error', {message: err.message})
        }
    },
    detailsQuestion: async ctx => {
        try {
            let checkLoggedin = false
            if(ctx.session.authorised !== true) {
                checkLoggedin = false
            } else {
                checkLoggedin = true
            }
            const detail = await DetailQuestionService.detailsQuestion({faqId: parseInt(ctx.params.id)})
            if(detail.nolist === undefined) {
                const answerList = await AnswerListService.getAnswers({faqId: parseInt(ctx.params.id), sessionid: ctx.session.userid})
                var options = {check: checkLoggedin, sessionid: ctx.session.userid, getInfo: detail}
                if(answerList.nolist !== undefined) {
                    options.noAnswer = answerList
                }
                options.getAnswers = answerList
            } else {
                throw Error("No FAQ found")
            }
            await ctx.render('detailsQuestion', options)
        } catch(err) {
            await ctx.render('error', {message: err.message})
        }
    },
    fullImage: async ctx => {
        try {
            var encodedData
            const readImage = await jimp.read(`./public/upload/FAQ/${ctx.params.id}.${ctx.query.type}`)
            readImage.getBase64(jimp.AUTO , function(e, img64){ encodedData = img64 })
            await ctx.render('viewFullImage', {encoded: encodedData})
        } catch (err) {
            await ctx.render('error', {message: err.message})
        }
    },
    newAnswer: async ctx => {
        try {
            const body = ctx.request.body
            await NewAnswerService.newAnswer({faqId: parseInt(ctx.params.id), description: body.answerInput, author: ctx.session.userid})
            ctx.redirect('/faq/' + ctx.params.id)
        } catch(err) {
            await ctx.render('error', {message: err.message})
        }
    },
    flagAnswer: async ctx => {
        try {
            await FlagAnswerService.flagAnswer({faqId: parseInt(ctx.params.id), sessionId: ctx.session.userid, answerId: parseInt(ctx.params.answerid), flagtype: parseInt(ctx.params.flagtype)})
            const getAnswer = await AnswerListService.getAnswers({id: parseInt(ctx.params.answerid)})
            if(getAnswer.nolist !== undefined) throw Error(`Error during contributing`)
            ctx.redirect('/faq/' + ctx.params.id)
        } catch(err) {
            await ctx.render('error', {message: err.message})
        }
    },
    rateAnswer: async ctx => {
        try {
            await RateAnswerService.rateAnswer({sessionId: ctx.session.userid, answerId: parseInt(ctx.params.answerid), rate: parseFloat(ctx.query.rate)})
            ctx.redirect('/faq/' + ctx.params.id)
        } catch(err) {
            await ctx.render('error', {message: err.message})
        }
    }
}