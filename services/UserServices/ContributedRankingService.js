/*eslint linebreak-style: ["error", "windows"]*/

'use strict'

const userModel = require('../../models/User'),
	func = require('../../function/function.general'),
	ufunc = require('../../function/function.user'),
	dbName = 'website.db'

exports.rankedContribute = async query => {
	try {
		func.mustHaveParameters([{variable: query.userid, numberOrlength: query.userid}])
		const User = await new userModel(dbName),
			getUser = await User.getUsers({userid: query.userid})
		if(getUser.length === 0) throw Error('Error during getting information')
		if(getUser[0].contribution === 0) return 'noStar'
		const allUsers = await User.getUsers({contribution: true})
		return ufunc.getAUserRank(allUsers, query.userid)
	} catch (e) {
		throw e
	}
}
