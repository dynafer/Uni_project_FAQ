/*eslint linebreak-style: ["error", "windows"]*/

'use strict'

const userModel = require('../../models/User'),
	func = require('../../function/function.general'),
	dbName = 'website.db'

exports.contribute = async query => {
	try {
		func.isLoggedin(query.userId)
		const User = await new userModel(dbName),
		    getUser = await User.getUsers({userid: query.userId})
		if(getUser.length === 0) throw Error('Error during contributing')
		if(getUser[0].contribution + query.contribution <= 0) {
			query.contribution = 0
		} else {
			query.contribution = getUser[0].contribution + query.contribution
		}
		const contribute = await User.contribute(query)
		return contribute
	} catch (e) {
		throw e
	}
}
