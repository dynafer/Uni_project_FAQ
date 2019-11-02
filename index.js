#!/usr/bin/env node

//Routes File

'use strict'

/* MODULE IMPORTS */
const Koa = require('koa');
const views = require('koa-views')
const staticDir = require('koa-static')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const handlebars = require('handlebars')
const UserRouter = require('./routes/UserRouter')
const FAQRouter = require('./routes/FAQRouter')

const app = new Koa()

handlebars.registerHelper("if_eq", function(a, b, opts) {
    if (a == b) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
})

/* CONFIGURING THE MIDDLEWARE */
app.keys = ['darkSecret']
app.use(staticDir('public'))
app.use(bodyParser())
app.use(session(app))
app.use(views(`${__dirname}/views`, { extension: 'handlebars' }, {map: { handlebars: 'handlebars' }}))

const defaultPort = 8080
const port = process.env.PORT || defaultPort 


app.use(userRouter.routes())
app.use(userRouter.allowedMethods())
app.use(FAQRouter.routes())
app.use(FAQRouter.allowedMethods())
module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))
