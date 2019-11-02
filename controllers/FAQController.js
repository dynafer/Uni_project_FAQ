
'use strict'

// Question Services
var QuestionListService = require('../services/QuestionServices/QuestionListService')
var NewQuestionService = require('../services/QuestionServices/NewQuestionService')

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
            await NewQuestionService.newQuestion(body)
            ctx.redirect(`/list`)
        } catch(err) {
            console.log(err)
            await ctx.render('error', {message: err.message})
        }
    }
}