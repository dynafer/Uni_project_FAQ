
'use strict'

const userModel = require('../../models/User'),
	faqModel = require('../../models/FAQ'),
	func = require('../../function/function.general'),
	dbName = 'website.db'

exports.detailsQuestion = async query => {
	try {
		func.mustHaveParameters([{variable: query.faqId, numberOrlength: query.faqId}])
		const FAQ = await new faqModel(dbName), User = await new userModel(dbName)
		const details = await FAQ.getQuestions(query)
		if(details.nolist === undefined) {
			if(details[0].imageBool === 1) {
				const imageData = await FAQ.QuestionThumbnail({id: details[0].id})
				details[0].imageData = imageData
			}
			const getAuthorName = await User.getUsers({userid: details[0].authorId})
			details[0].author = getAuthorName[0].user
		} else {
			throw Error('Can\'t find the question')
		}
		return details[0]
	} catch (e) {
		throw e
	}
}
