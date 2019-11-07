
'use strict'

var userModel = require('../../models/User')
var faqModel = require('../../models/FAQ')

exports.getAnswers = async function (query) {
    try {
        var FAQ = await new faqModel("website.db")
        var User = await new userModel("website.db")
		var list = await FAQ.getAnswers(query)
		if(list.nolist === undefined) {
			for(var i=0; i<list.length; i++) {
				const getAuthorName = await User.getUsers({userid: list[i].authorId})
				list[i].author = getAuthorName[0].user
				const getAnswerRate = await FAQ.getAnswerRates({answerId: list[i].id})
				const getQuestion = await FAQ.getQuestions({faqId: query.faqId})
				if(getQuestion.nolist !== undefined) throw Error(`The question doesn't exist`)
				var average_rate = 0.0
				if(getAnswerRate.nolist === undefined) {
					for(var l=0; l<getAnswerRate.length; l++) {
						average_rate = average_rate + getAnswerRate[l].rate
					}
					if(average_rate !== 0.0) average_rate = (average_rate / getAnswerRate.length).toFixed(1)
				} else {
					average_rate = 0.0
				}
				let tempRate = String(average_rate)
				var ratedHTMLstars = ''
				if(average_rate === 0) {
					for(var star = 0; star < 5; star++) {
						ratedHTMLstars = ratedHTMLstars + '<span class="full"></span>'
					}
				} else {
					tempRate = tempRate.split('.')
					tempRate[0] = parseInt(tempRate[0])	// to make string to integer
					tempRate[1] = parseInt(tempRate[1])	// to make string to integer
					while(tempRate[0] > 0) {
						ratedHTMLstars = ratedHTMLstars + '<span class="full checked"></span>'
						tempRate[0]--;
					}
					if(tempRate[1] !== 0) {
						ratedHTMLstars = ratedHTMLstars + '<span class="half checked"></span><span class="full"></span>'
						tempRate[1] = 0
					}
					let getRest = Math.floor(5.0 - average_rate)
					while(getRest !== 0) {
						ratedHTMLstars = ratedHTMLstars + '<span class="full"></span>'
						getRest--;
					}
				}
				list[i].averageRate = ratedHTMLstars
				if(query.sessionid !== 0 && query.sessionid !== null && query.sessionid !== undefined) {
					list[i].sessionid = query.sessionid
				}
				
				list[i].questionAuthor = getQuestion[0].authorId
				list[i].solved = getQuestion[0].solved
			}
		}
        return list;
    } catch (e) {
        throw e
    }
}