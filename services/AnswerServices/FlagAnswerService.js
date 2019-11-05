
'use strict'

var faqModel = require('../../models/FAQ')

exports.flagAnswer = async function (query) {
    try {
        if(query.flagtype === 1 || query.flagtype === 2) {
            var FAQ = await new faqModel("website.db")
            const checkAuthor = await FAQ.getQuestions({faqId: query.faqId})
            if(checkAuthor.length === 0) throw new Error(`No FAQ found`)
            if(checkAuthor[0].authorId !== query.sessionId) throw new Error(`No permission`)
            if(checkAuthor[0].solved !== 0) throw new Error(`Already Solved`)
            const flagAnswer = await FAQ.getAnswers({id: query.answerId})
            if(flagAnswer.length === 0) throw new Error(`No Answer found`)
            if(flagAnswer[0].faqId !== query.faqId) throw new Error(`Access in a wrong way`)
            if(flagAnswer[0].flagged !== 0) throw new Error(`Already Flagged`)
            if(flagAnswer[0].authorId === query.sessionId) throw new Error(`Can't flag your own answer`)
            await FAQ.flagAnswer(query)
            return true
        } else {
            throw Error(`Access in a wrong way`)
        }
    } catch (e) {
        throw e
    }
}