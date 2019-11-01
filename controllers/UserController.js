const User = require('../models/User')
const dbName = 'website.db'

module.exports = {
    home: async ctx => {
        try {
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
            const user = await new User(dbName)
            await user.login(body.user, body.pass)
            ctx.session.authorised = true
            return ctx.redirect('/?msg=you are now logged in...')
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
            console.log(body)
            // call the functions in the module
            const user = await new User(dbName)
            await user.register(body.user, body.pass)
            // await user.uploadPicture(path, type)
            // redirect to the home page
            ctx.redirect(`/?msg=new user "${body.name}" added`)
        } catch(err) {
            await ctx.render('error', {message: err.message})
        }
    },
    logout: async ctx => {
        ctx.session.authorised = null
        ctx.redirect('/?msg=you are now logged out')
    }
}