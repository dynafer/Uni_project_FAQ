
'use strict'

var userModel = require('../../models/User')

exports.register = async function (query) {
    try {
        var User = await new userModel("website.db")
        if(query.user.length === 0) throw Error('missing username')
        if(query.pass.length === 0) throw Error('missing password')
        if(query.pass2.length === 0) throw Error('missing confirm password')
        if(query.pass != query.pass2) throw Error('confirm password are incorrect')
        const getUser = await User.getUsers({username: query.user})
        if(getUser.length > 0) throw Error(`username "${query.user}" already in use`)
        var register = await User.register(query)
        return register;
    } catch (e) {
        throw e
    }
}