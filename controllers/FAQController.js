
'use strict'

const jimp = require('jimp'),
	func = require('../function/function.general'),

	// User Services
	ContributeService = require('../services/UserServices/ContributeService'),
	ContributedRankingService = require('../services/UserServices/ContributedRankingService'),

	// Question Services
	QuestionListService = require('../services/QuestionServices/QuestionListService'),
	NewQuestionService = require('../services/QuestionServices/NewQuestionService'),
	UploadPictureService = require('../services/QuestionServices/UploadPictureService'),
	DetailQuestionService = require('../services/QuestionServices/DetailQuestionService'),

	// Answer Services
	AnswerListService = require('../services/AnswerServices/AnswerListService'),
	NewAnswerService = require('../services/AnswerServices/NewAnswerService'),
	FlagAnswerService = require('../services/AnswerServices/FlagAnswerService'),
	RateAnswerService = require('../services/AnswerServices/RateAnswerService')

module.exports = {
	questionList: async ctx => {
		try {
			const checkLoggedin = func.checkLAuthorised(ctx.session.authorised)
			const getList = await QuestionListService.getQuestions({})
			for(let i = 0; i < getList.length; i ++) {
				getList[i].rankedUser = await ContributedRankingService.rankedContribute({userid: getList[i].authorId})
			}
			await ctx.render('list', {check: checkLoggedin, list: getList})
		} catch(err) {
			console.log(err)
			await ctx.render('error', {message: err.message})
		}
	},
	newQuestionForm: async ctx => {
		try {
			const checkLoggedin = func.checkLAuthorised(ctx.session.authorised)
			await ctx.render('writeQuestion', {check: checkLoggedin})
		} catch(err) {
			console.log(err)
			await ctx.render('error', {message: err.message})
		}
	},
	newQuestion: async ctx => {
		try {
			const body = ctx.request.body,
				{path, type, size} = ctx.request.files.image
			body.imageBool = func.isZeroSizeOfImage(size)
			body.imageType = type
			body.author = ctx.session.userid
			const checkTrue = await NewQuestionService.newQuestion(body)
			if(checkTrue === true && size !== 0) {
				const getList = (await QuestionListService.getQuestions({}))[0]
				await UploadPictureService.uploadPicture({listid: getList.id, path: path, type: type})
			}
			ctx.redirect('/list')
		} catch(err) {
			await ctx.render('error', {message: err.message})
		}
	},
	detailsQuestion: async ctx => {
		try {
			const checkLoggedin = func.checkLAuthorised(ctx.session.authorised),
			    detail = await DetailQuestionService.detailsQuestion({ faqId: parseInt(ctx.params.id) })
			detail.rankedUser = await ContributedRankingService.rankedContribute({userid: detail.authorId})
			if(detail.nolist !== undefined) throw Error('No FAQ found')
			const answerList = await AnswerListService.getAnswers({
				faqId: parseInt(ctx.params.id),
				sessionid: ctx.session.userid })
			for(let i = 0; i < answerList.length; i ++) {
				answerList[i].rankedUser = await ContributedRankingService.rankedContribute({
					userid: answerList[i].authorId })
			}
			const options = { check: checkLoggedin, sessionid: ctx.session.userid, getInfo: detail }
			options.getAnswers = answerList.nolist === undefined ? answerList : 'nolist'
			await ctx.render('detailsQuestion', options)
		} catch(err) {
			await ctx.render('error', {message: err.message})
		}
	},
	fullImage: async ctx => {
		try {
			let encodedData = null
			const readImage = await jimp.read(`./public/upload/FAQ/${ctx.params.id}.${ctx.query.type}`)
			readImage.getBase64(jimp.AUTO,
				(e, img64) => {
					encodedData = img64
				})
			await ctx.render('viewFullImage', {encoded: encodedData})
		} catch (err) {
			await ctx.render('error', {message: err.message})
		}
	},
	newAnswer: async ctx => {
		try {
			const body = ctx.request.body
			await NewAnswerService.newAnswer({
				faqId: parseInt(ctx.params.id),
				description: body.answerInput,
				author: ctx.session.userid
			})
			ctx.redirect(`/faq/${ctx.params.id}`)
		} catch(err) {
			await ctx.render('error', {message: err.message})
		}
	},
	flagAnswer: async ctx => {
		try {
			await FlagAnswerService.flagAnswer({
				faqId: parseInt(ctx.params.id),
				sessionId: ctx.session.userid,
				answerId: parseInt(ctx.params.answerid),
				flagtype: parseInt(ctx.params.flagtype)
			})
			const getAnswer = await AnswerListService.getAnswers({ id: parseInt(ctx.params.answerid) })
			if(getAnswer.nolist !== undefined) throw Error('Error during contributing')
			const addNumber = 50,
				minusNumber = -5
			const contribution = parseInt(ctx.params.flagtype) === 1 ? addNumber : minusNumber
			await ContributeService.contribute({userId: getAnswer[0].authorId, contribution: contribution})
			ctx.redirect(`/faq/${ctx.params.id}`)
		} catch(err) {
			await ctx.render('error', {message: err.message})
		}
	},
	rateAnswer: async ctx => {
		try {
			await RateAnswerService.rateAnswer({
				sessionId: ctx.session.userid,
				answerId: parseInt(ctx.params.answerid),
				rate: parseFloat(ctx.query.rate)})
			ctx.redirect(`/faq/${ctx.params.id}`)
		} catch(err) {
			await ctx.render('error', {message: err.message})
		}
	}
}
