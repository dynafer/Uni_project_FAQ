/*eslint linebreak-style: ["error", "windows"]*/

'use strict'

const faqModel = require('../../models/FAQ'),
	func = require('../../function'),
	dbName = 'website.db'

exports.flagAnswer = async query => {
	try {
		const flagTypes = {'0': 1, '1': 2}
		if(query.flagtype !== flagTypes['0'] && query.flagtype !== flagTypes['1']) throw Error('Access in a wrong way')
		const FAQ = await new faqModel(dbName)
		func.isLoggedin(query.sessionId)
		func.mustHaveParameter([{variable: query.faqId, numberOrlength: query.faqId},
			{variable: query.answerId, numberOrlength: query.answerId},
			{variable: query.flagtype, numberOrlength: query.flagtype}
		])
		const checkAuthor = await FAQ.getQuestions({faqId: query.faqId})
		func.flagCheckQuestionAuthor(checkAuthor, query.sessionId)
		const flagAnswer = await FAQ.getAnswers({id: query.answerId})
		func.flagCheckAnswer(flagAnswer, query.faqId, query.sessionId)
		await FAQ.flagAnswer(query)
		return true
	} catch (e) {
		throw e
	}
}