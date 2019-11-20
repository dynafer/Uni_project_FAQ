/*eslint linebreak-style: ["error", "windows"]*/
'use strict'

const userModel = require('../../models/User'),
	func = require('../../function/function.general'),
	dbName = 'website.db'

exports.uploadAvatar = async files => {
	try {
		func.mustHaveParameters([{variable: files.user, numberOrlength: 1}])
		if(files.user.length === 0) throw Error('Error during uploading')
		const User = await new userModel(dbName),
			upload = await User.uploadPicture(files)
		return upload
	} catch (e) {
		throw e
	}
}
