var faqModel = require('../../models/FAQ')

exports.newAnswer = async function (query) {
    try {
        var FAQ = await new faqModel("website.db")
		if(query.author === 0) throw Error("You don't login yet")
		if(query.faqId === 0) throw Error('You accessed in a wrong way')
        if(query.description.length === 0) throw Error('missing description')
        const checkSolved = await FAQ.getQuestions({faqId: query.faqId})
        if(checkSolved[0].solved !== 0) throw Error('Already Solved')
        const checkAdd = await FAQ.newAnswer(query)
        return checkAdd;
    } catch (e) {
        throw e
    }
}