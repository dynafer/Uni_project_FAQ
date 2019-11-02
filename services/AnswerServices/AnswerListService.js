
'use strict'

var userModel = require('../../models/User')
var faqModel = require('../../models/FAQ')

exports.getAnswers = async function (query) {
    try {
        var FAQ = await new faqModel("website.db")
        var User = await new userModel("website.db")
		var list = await FAQ.getAnswers(query)
		if(query.sessionid !== undefined) {
			if(list.nolist === undefined) {
				for(var i=0; i<list.length; i++) {
					const getAuthorName = await User.getUsers({userid: list[i].authorId})
					list[i].author = getAuthorName[0].user
					const getQuestion = await FAQ.getQuestions({faqId: query.faqId})
					list[i].sessionid = query.sessionid
					list[i].questionAuthor = getQuestion[0].authorId
					list[i].solved = getQuestion[0].solved
				}
			}
		}
        return list;
    } catch (e) {
        console.log(e)
        throw e
    }
}