
'use strict'

var faqModel = require('../../models/FAQ')

exports.flagAnswer = async function (query) {
    try {
        if(query.flagtype === 1 || query.flagtype === 2) {
            var FAQ = await new faqModel("website.db")
            if(query.sessionId === 0 || query.sessionId === undefined || query.sessionId === null) throw Error(`You don't login yet`)
            if(query.faqId === 0 || query.faqId === undefined || query.faqId === null) throw Error(`Access in a wrong way`)
            if(query.answerId === 0 || query.answerId === undefined || query.answerId === null) throw Error(`Access in a wrong way`)
            if(query.flagtype === 0 || query.flagtype === undefined || query.flagtype === null) throw Error(`Access in a wrong way`)
            const checkAuthor = await FAQ.getQuestions({faqId: query.faqId})
            if(checkAuthor.nolist !== undefined) throw Error(`No Question found`)
            if(checkAuthor[0].authorId !== query.sessionId) throw Error(`No permission`)
            if(checkAuthor[0].solved !== 0) throw Error(`Already Solved`)
            const flagAnswer = await FAQ.getAnswers({id: query.answerId})
            if(flagAnswer.nolist !== undefined) throw Error(`No Answer found`)
            if(flagAnswer[0].faqId !== query.faqId) throw Error(`Access in a wrong way`)
            if(flagAnswer[0].flagged !== 0) throw Error(`Already Flagged`)
            if(flagAnswer[0].authorId === query.sessionId) throw Error(`Can't flag your own answer`)
            await FAQ.flagAnswer(query)
            return true
        } else {
            throw Error(`Access in a wrong way`)
        }
    } catch (e) {
        throw e
    }
}