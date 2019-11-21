/*eslint linebreak-style: ["error", "windows"]*/

'use strict'

const userModel = require('../../models/User'),
	faqModel = require('../../models/FAQ'),
	dbName = 'website.db'

exports.getQuestions = async query => {
	const FAQ = await new faqModel(dbName),
		User = await new userModel(dbName)
	const lists = await FAQ.getQuestions(query)
	if(lists.nolist === undefined) {
		for(let i=0; i<lists.length; i++) {
			const getAuthorName = await User.getUsers({userid: lists[i].authorId})
			lists[i].author = getAuthorName[0].user
		}
	}
	return lists
}
