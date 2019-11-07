
'use strict'

var userModel = require('../../models/User')
var faqModel = require('../../models/FAQ')

exports.getQuestions = async function (query) {
    try {
        var FAQ = await new faqModel("website.db")
        var User = await new userModel("website.db")
        var lists = await FAQ.getQuestions(query)
        if(lists.nolist === undefined) {
            for(var i=0; i<lists.length; i++) {
                const getAuthorName = await User.getUsers({userid: lists[i].authorId})
                lists[i].author = getAuthorName[0].user
            }
        }
        return lists;
    } catch (e) {
        throw e
    }
}