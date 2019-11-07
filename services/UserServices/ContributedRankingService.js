
'use strict'

var userModel = require('../../models/User')

exports.rankedContribute = async function (query) {
    try {
        if(query.userid === 0 || query.userid === null || query.userid === undefined) throw Error(`Error for assigning a user`)
        var User = await new userModel("website.db")
        const getUser = await User.getUsers({userid: query.userid})
        if(getUser.length === 0) throw Error(`Error during getting information`)
        if(getUser[0].contribution === 0) return "noStar"
        const allUsers = await User.getUsers({contribution: true})
        var gold = allUsers.length * 5 / 100
        var silver = allUsers.length * 25 / 100
        var bronze = allUsers.length * 50 / 100
        var ranked = 0
        var next_rank = 0
        for(var i = 0; i < allUsers.length; i ++) {
            if(i !== 0) {
                if(allUsers[i-1].contribution === allUsers[i].contribution) {
                    next_rank = next_rank + 1
                } else if(next_rank !== 0) {
                    ranked = ranked + next_rank
                    next_rank = 0
                } else {
                    ranked = ranked + 1
                }
            } else {
                next_rank = 1
            }
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