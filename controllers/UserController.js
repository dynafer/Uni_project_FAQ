
'use strict'

const func = require('../function/function.general'),
	LoginService = require('../services/UserServices/LoginService'),
	RegisterService = require('../services/UserServices/RegisterService'),
	UploadAvatarService = require('../services/UserServices/UploadAvatarService'),
	ContributionRankingList = require('../services/UserServices/ContributionRankingList')

module.exports = {
	home: async ctx => {
		try {
			const checkLoggedin = func.checkLAuthorised(ctx.session.authorised)
			await ctx.render('index', {check: checkLoggedin})
		} catch(err) {
			console.log(err)
			await ctx.render('error', {message: err.message})
		}
	},
	loginForm: async ctx => {
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		if(ctx.query.user) data.user = ctx.query.user
		await ctx.render('login', data)
	},
	login: async ctx => {
		try {
			const body = ctx.request.body
			const data = await LoginService.login(body)
			ctx.session.userid = data.userid
			ctx.session.authorised = data.authorised
			return ctx.redirect('/')
		} catch(err) {
			await ctx.render('error', {message: err.message})
		}
	},
	registerForm: async ctx => {
		await ctx.render('register')
	},
	register: async ctx => {
		try {
			// extract the data from the request
			const body = ctx.request.body
			const {path, type, size} = ctx.request.files.avatar
			const checkTrue = await RegisterService.register(body)
			if(checkTrue === true && size !== 0) {
				await UploadAvatarService.uploadAvatar({user: body.user, path: path, type: type})
			}
			// redirect to the home page
			ctx.redirect('/')
		} catch(err) {
			await ctx.render('error', {message: err.message})
		}
	},
	logout: async ctx => {
		ctx.session.authorised = null
		ctx.session.userid = null
		ctx.redirect('/')
	},
	ranking: async ctx => {
		const checkLoggedin = func.checkLAuthorised(ctx.session.authorised)
		const list = await ContributionRankingList.rankedContribute()
		await ctx.render('rankingList', {check: checkLoggedin, list: list})
	}
}
