/*eslint linebreak-style: ["error", "windows"]*/

'use strict'

const faqModel = require('../../models/FAQ'),
	func = require('../../function/function.general'),
	dbName = 'website.db'

exports.uploadPicture = async files => {
	try {
		func.mustHaveParameter([{variable: files.listid, numberOrlength: files.listid}])
		const FAQ = await new faqModel(dbName),
			upload = await FAQ.uploadPicture(files)
		return upload
	} catch (e) {
		throw e
	}
}
