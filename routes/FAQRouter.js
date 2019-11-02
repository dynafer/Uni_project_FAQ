
'use strict'

const Router = require('koa-router')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const router = new Router()

router.get('/list', async cnx => {
    try {
        let checkLoggedin = false
        if(ctx.session.authorised !== true) {
            checkLoggedin = false
        } else {
            checkLoggedin = true
        }
        await ctx.render('index', {check: checkLoggedin})
    } catch(err) {
        console.log(err)
        await ctx.render('error', {message: err.message})
    }
})
module.exports = router