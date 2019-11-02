
'use strict'

var userModel = require('../../models/User')
var faqModel = require('../../models/FAQ')

exports.detailsQuestion = async function (query) {
    try {
        var FAQ = await new faqModel("website.db")
        var User = await new userModel("website.db")
        const details = await FAQ.getQuestions(query)
        if(details.nolist === undefined) {
            if(details[0].imageBool === 1) {
                const imageData = await FAQ.QuestionThumbnail({id: details[0].id})
                details[0].imageData = imageData
            }
            const getAuthorName = await User.getUsers({userid: details[0].authorId})
            details[0].author = getAuthorName[0].user
        }
        return details[0]
    } catch (e) {
        console.log(e)
        throw e
    }
}