/*eslint linebreak-style: ["error", "windows"]*/

'use strict'

const faqModel = require('../../models/FAQ'),
	func = require('../../function/function.general'),
	dbName = 'website.db'

exports.newAnswer = async query => {
	try {
		const FAQ = await new faqModel(dbName)
		func.isLoggedin(query.sessionId)
		func.mustHaveParameter([{variable: query.faqId, numberOrlength: query.faqId}])
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
