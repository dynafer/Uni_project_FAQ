
'use strict'

const userModel = require('../../models/User'),
	ufunc = require('../../function/function.user'),
	ContributedRankingService = require('./ContributedRankingService'),
	dbName = 'website.db'

exports.rankingList = async function() {
	const User = await new userModel(dbName),
		allUsers = await User.getUsers({contribution: true})
	if(allUsers.length === 0) return {nolist: true}
	for(let i = 0; i < allUsers.length; i++) {
		allUsers[i].pass = null
		allUsers[i].rank = ufunc.findAUserRank(allUsers, allUsers[i].id) + 1
		allUsers[i].rankedUser = await ContributedRankingService.rankedContribute({userid: allUsers[i].id})
	}
	return allUsers
}
