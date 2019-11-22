
'use strict'

const userModel = require('../../models/User'),
	ufunc = require('../../function/function.user'),
	dbName = 'website.db'

exports.register = async query => {
	try {
		const User = await new userModel(dbName)
		ufunc.checkRegisterInputValid(query)
		const getUser = await User.getUsers({username: query.user})
		if(getUser.length > 0) throw Error(`username "${query.user}" already in use`)
		const register = await User.register(query)
		return register
	} catch (e) {
		throw e
	}
}
