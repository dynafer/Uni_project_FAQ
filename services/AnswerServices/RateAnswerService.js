/*eslint linebreak-style: ["error", "windows"]*/

'use strict'

const faqModel = require('../../models/FAQ'),
	func = require('../../function/function.general'),
	afunc = require('../../function/function.answer'),
	dbName = 'website.db'

exports.rateAnswer = async query => {
	try {
		const FAQ = await new faqModel(dbName),
			maxRate = 5
		func.isLoggedin(query.sessionId)
		func.mustHaveParameter([{variable: query.answerId, numberOrlength: query.answerId}])
		if(func.isNull(query.rate, query.rate) || query.rate > maxRate) throw new Error('Error to rate')
		const getAnswer = await FAQ.getAnswers({id: query.answerId})
		afunc.rateCheckAnswer(getAnswer, query.sessionId)
		const getAnswerRate = await FAQ.getAnswerRates({answerId: query.answerId, userId: query.sessionId})
		if(getAnswerRate.nolist === undefined) throw Error('Already Rated')
		const checkAdd = await FAQ.newRate(query)
		return checkAdd
	} catch (e) {
		throw e
	}
}
