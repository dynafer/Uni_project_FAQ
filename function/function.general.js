/*eslint linebreak-style: ["error", "windows"]*/

'use strict'

function checkLAuthorised(authorised) {
	if(authorised !== true) {
		return false
	} else {
		return true
	}
}

function isLoggedin(sessionid) {
	if(isNotNull(sessionid, sessionid) === false) {
		throw Error('You don\'t login yet')
	} else {
		return true
	}
}

function isNull(variable, numberOrlength) {
	if(variable === undefined || variable === null || numberOrlength === 0) {
		return true
	} else {
		return false
	}
}

function isNotNull(variable, numberOrlength) {
	if(variable === undefined || variable === null || numberOrlength === 0) {
		return false
	} else {
		return true
	}
}

function isAuthor(authorid, sessionid) {
	mustHaveParameters([
		{variable: authorid, numberOrlength: authorid},
		{variable: sessionid, numberOrlength: sessionid}
	])
	if(authorid === sessionid) {
		return true
	} else {
		throw Error('No permission')
	}
}

function mustHaveParameters(query) {
	const length = query ? query.length : 0
	if(length === 0) throw Error('Access in a wrong way')
	for(let i = 0; i < length; i ++) {
		if(isNull(query[i].variable, query[i].numberOrlength)) {
			throw Error('Access in a wrong way')
		} else {
			continue
		}
	}
	return true
}

function isZeroSizeOfImage(size) {
	if(size !== 0) {
		return 1
	} else {
		return 0
	}
}

module.exports = { checkLAuthorised, isLoggedin, isNull, isNotNull, isAuthor, mustHaveParameters, isZeroSizeOfImage }
