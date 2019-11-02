
'use strict'

var userModel = require('../../models/User')

exports.login = async function (query) {
    try {
        var User = await new userModel("website.db")
        const getUser = await User.getUsers({username: query.user})
        if(getUser.length === 0) throw Error(`username "${query.user}" not found`)
        var checkAuth = await User.login(query)
        if(checkAuth.authorised === false) {
            throw Error(`invalid password for account "${query.user}"`)
        } else {
            return checkAuth;
        }
    } catch (e) {
        throw e
    }
}