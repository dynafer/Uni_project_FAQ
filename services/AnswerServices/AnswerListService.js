/*eslint linebreak-style: ["error", "windows"]*/
'use strict'

const userModel = require('../../models/User'),
	faqModel = require('../../models/FAQ'),
	func = require('../../function'),
	dbName = 'website.db'

exports.getAnswers = async query => {
	try {
		const FAQ = await new faqModel(dbName), User = await new userModel(dbName), list = await FAQ.getAnswers(query)
		for(let i=0; i<list.length; i++) {
			const getAuthorName = await User.getUsers({userid: list[i].authorId}),
				getAnswerRate = await FAQ.getAnswerRates({answerId: list[i].id}),
				getQuestion = await FAQ.getQuestions({faqId: query.faqId})
			list[i].author = getAuthorName[0].user
			if(getQuestion.nolist !== undefined) throw Error('The question doesn\'t exist')
			const averageRate = String(func.getRateAverage(getAnswerRate))
			list[i].averageRate = func.getRateStarHTML(averageRate)
			list[i].sessionid = func.isNotNull(query.sessionid, query.sessionid) === true ? query.sessionid : 0
			list[i].questionAuthor = getQuestion[0].authorId
			list[i].solved = getQuestion[0].solved
		}
		return list
	} catch (e) {
		throw e
	}
}
