
'use strict'

var faqModel = require('../../models/FAQ')

exports.uploadPicture = async function (files) {
    try {
        var FAQ = await new faqModel("website.db")
        var upload = await FAQ.uploadPicture(files)
        return upload;
    } catch (e) {
        throw e
    }
}