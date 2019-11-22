
'use strict'

const faqModel = require('../../models/FAQ'),
	func = require('../../function/function.general'),
	dbName = 'website.db'

exports.newQuestion = async query => {
	try {
		func.isLoggedin(query.author)
		func.mustHaveParameters([{variable: query.title, numberOrlength: 1},
			{variable: query.description, numberOrlength: 1}
		])
		if(query.title.length === 0) throw Error('missing title')
		if(query.description.length === 0) throw Error('missing description')
		const FAQ = await new faqModel(dbName),
			checkAdd = await FAQ.newQuestion(query)
		return checkAdd
	} catch (e) {
		throw e
	}
}
