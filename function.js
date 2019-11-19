/*eslint linebreak-style: ["error", "windows"]*/

'use strict'

function isLoggedin(authorised) {
	if(authorised !== true) {
		return false
	} else {
		return true
	}
}

function isZeroSizeOfImage(size) {
	if(size !== 0) {
		return 1
	} else {
		return 0
	}
}

function isNotNull(variable, numberOrlength) {
	if(variable === undefined || variable === null || numberOrlength === 0) {
		return false
	} else {
		return true
	}
}

module.exports = { isLoggedin, isZeroSizeOfImage, isNotNull }
