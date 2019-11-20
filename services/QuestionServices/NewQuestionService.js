/*eslint linebreak-style: ["error", "windows"]*/

'use strict'

const faqModel = require('../../models/FAQ'),
	func = require('../../function/function.general'),
	dbName = 'website.db'

exports.newQuestion = async query => {
	try {
		func.isLoggedin(query.author)
		if(query.title.length === 0) throw Error('missing title')
		if(query.description.length === 0) throw Error('missing description')
		const FAQ = await new faqModel(dbName),
			checkAdd = await FAQ.newQuestion(query)
		return checkAdd
	} catch (e) {
		throw e
	}
}
