
'use strict'

// Question Services
var QuestionListService = require('../services/QuestionServices/QuestionListService')

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
    }
}