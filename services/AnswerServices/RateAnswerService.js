
'use strict'

var faqModel = require('../../models/FAQ')

exports.rateAnswer = async function (query) {
    try {
        var FAQ = await new faqModel("website.db")
        if(query.sessionId === 0 || query.sessionId === null) throw Error(`You didn't login yet`)
        if(query.answerId === 0 || query.answerId === undefined) throw Error(`Access in a wrong way`)
        if(query.rate < 1 || query.rate > 5) throw new Error(`Error to rate`)
        const getAnswer = await FAQ.getAnswers({id: query.answerId})
        if(getAnswer[0].authorId === query.sessionId) throw new Error(`Can't rate your own answer`)
        const getAnswerRate = await FAQ.getAnswerRates({answerId: query.answerId, userId: query.sessionId})
        if(getAnswerRate.nolist === undefined) throw Error(`Already Rated`)
        const checkAdd = await FAQ.newRate(query)
        return checkAdd;
    } catch (e) {
        throw e
    }
}