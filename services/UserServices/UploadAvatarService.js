
'use strict'

var userModel = require('../../models/User')

exports.uploadAvatar = async function (files) {
    try {
        var User = await new userModel("website.db")
        var upload = await User.uploadPicture(files)
        return upload;
    } catch (e) {
        throw e
    }
}