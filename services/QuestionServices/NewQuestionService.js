
'use strict'

var faqModel = require('../../models/FAQ')

exports.newQuestion = async function (query) {
    try {
		if(query.author === 0 || query.author === null || query.author === undefined) throw Error("You don't login yet")
		if(query.title.length === 0) throw Error('missing title')
        if(query.description.length === 0) throw Error('missing description')
        var FAQ = await new faqModel("website.db")
        const checkAdd = await FAQ.newQuestion(query)
        return checkAdd;
    } catch (e) {
        throw e
    }
}