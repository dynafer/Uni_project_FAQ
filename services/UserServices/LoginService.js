/*eslint linebreak-style: ["error", "windows"]*/

'use strict'

const userModel = require('../../models/User'),
	dbName = 'website.db'

exports.login = async query => {
	try {
		const User = await new userModel(dbName),
			getUser = await User.getUsers({username: query.user})
		if(getUser.length === 0) throw Error(`username "${query.user}" not found`)
		const checkAuth = await User.login(query)
		if(checkAuth.authorised === false) {
			throw Error(`invalid password for account "${query.user}"`)
		} else {
			return checkAuth
		}
	} catch (e) {
		throw e
	}
}
