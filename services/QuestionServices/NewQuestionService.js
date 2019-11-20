/*eslint linebreak-style: ["error", "windows"]*/

'use strict'

const faqModel = require('../../models/FAQ'),
	func = require('../../function/function.general'),
	dbName = 'website.db'

exports.newQuestion = async query => {
	try {
		func.isLoggedin(query.author)
		func.mustHaveParameters([{variable: query.title, numberOrlength: query.title.length},
			{variable: query.description, numberOrlength: query.description.length}
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
