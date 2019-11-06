
'use strict'

var faqModel = require('../../models/FAQ')

exports.uploadPicture = async function (files) {
    try {
        if(files.listid === 0 || files.listid === null || files.listid === undefined) throw Error(`Error during uploading`)
        var FAQ = await new faqModel("website.db")
        var upload = await FAQ.uploadPicture(files)
        return upload;
    } catch (e) {
        throw e
    }
}