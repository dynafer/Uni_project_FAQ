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

module.exports = { isLoggedin, isZeroSizeOfImage }
