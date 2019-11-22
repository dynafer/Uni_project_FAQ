
'use strict'

const faqModel = require('../../models/FAQ'),
	func = require('../../function/function.general'),
	dbName = 'website.db'

exports.newAnswer = async query => {
	try {
		const FAQ = await new faqModel(dbName)
		func.isLoggedin(query.author)
		func.mustHaveParameters([{variable: query.faqId, numberOrlength: query.faqId},
			{variable: query.description, numberOrlength: 1}
		])
		if(query.description.length === 0) throw Error('missing description')
		const checkSolved = await FAQ.getQuestions({faqId: query.faqId})
		if(checkSolved.nolist !== undefined) throw Error('No Question found')
		if(checkSolved[0].solved !== 0) throw Error('Already Solved')
		const checkAdd = await FAQ.newAnswer(query)
		return checkAdd
	} catch (e) {
		throw e
	}
}
