
'use strict'

var userModel = require('../../models/User')

exports.rankedContribute = async function (query) {
    try {
        var User = await new userModel("website.db")
        const getUser = await User.getUsers({userid: query.userid})
        if(getUser.length === 0) throw Error(`Error during getting information`)
        if(getUser[0].contribution === 0) return "noStar"
        const allUsers = await User.getUsers({contribution: true})
        if(allUsers.length === 0) throw Error(`Error during getting information`)
        var gold = allUsers.length * 5 / 100
        var silver = allUsers.length * 25 / 100
        var bronze = allUsers.length * 50 / 100
        var ranked = 0
        for(var i = 0; i < allUsers.length; i ++) {
            ranked = i + 1
            if(allUsers[i].id === getUser[0].id) {
                break
            } else {
                continue
            }
        }
        if(ranked <= gold) return "goldStar"
        if(ranked <= silver) return "silverStar"
        if(ranked <= bronze) return "bronzeStar"
        return "noStar"
    } catch (e) {
        throw e
    }
}