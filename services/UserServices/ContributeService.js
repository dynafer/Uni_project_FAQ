
'use strict'

var userModel = require('../../models/User')

exports.contribute = async function (query) {
    try {
        if(query.userId === 0 || query.userId === null || query.userId === undefined) throw Error(`You don't login yet`)
        var User = await new userModel("website.db")
        const getUser = await User.getUsers({userid: query.userId})
        if(getUser.length === 0) throw Error(`Error during contributing`)
        if((getUser[0].contribution + query.contribution) <= 0) {
            query.contribution = 0
        } else {
            query.contribution = getUser[0].contribution + query.contribution
        }
        var contribute = await User.contribute(query)
        return contribute;
    } catch (e) {
        throw e
    }
}