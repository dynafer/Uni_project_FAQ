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
	if(authorid === sessionid) {
		return true
	} else {
		throw Error('No permission')
	}
}

function mustHaveParameters(query) {
	for(let i = 0; i < query.length; i ++) {
		if(isNull(query.variable, query.numberOrlength)) {
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

function flagCheckQuestionAuthor(checkAuthor, sessionid) {
	if(checkAuthor.nolist !== undefined) {
		throw Error('No Question found')
	}
	isAuthor(checkAuthor[0].authorId, sessionid)
	if(checkAuthor[0].solved !== 0) {
		throw Error('Already Solved')
	}
}

function flagCheckAnswer(flagAnswer, faqId, sessionid) {
	if(flagAnswer.nolist !== undefined) throw Error('No Answer found')
	if(flagAnswer[0].faqId !== faqId) throw Error('Access in a wrong way')
	if(flagAnswer[0].flagged !== 0) throw Error('Already Flagged')
	if(flagAnswer[0].authorId === sessionid) throw Error('Can\'t flag your own answer')
}

function getRateAverage(getAnswerRate) {
	let averageRate = 0.0
	if(getAnswerRate.nolist === undefined) {
		for(let l=0; l<getAnswerRate.length; l++) {
			averageRate = averageRate + getAnswerRate[l].rate
		}
		averageRate = (averageRate / getAnswerRate.length).toFixed(1)
	} else {
		averageRate = 0.0
	}
	return averageRate
}

function beforeGetRateStar(averageRate) {
	const boolZero = averageRate === 0 || averageRate === 0.0 ? true : false
	averageRate = averageRate.split('.')
	averageRate[0] = parseInt(averageRate[0])
	averageRate[1] = parseInt(averageRate[1])
	return {data: averageRate, boolZero: boolZero}
}

function getZeroRateStar() {
	let ratedHTMLstars = ''
	const maxStar = 5
	for(let star = 0; star < maxStar; star++) {
		ratedHTMLstars += '<span class="full"></span>'
	}
	return ratedHTMLstars
}

function getRateStar(averageRate) {
	let ratedHTMLstars = ''
	const maxRate = 5.0
	while(averageRate[0] > 0) {
		ratedHTMLstars += '<span class="full checked"></span>'
		averageRate[0]--
	}
	if(averageRate[1] !== 0) {
		ratedHTMLstars += '<span class="half checked"></span><span class="full"></span>'
		averageRate[1] = 0
	}
	for(let getRest = Math.floor(maxRate - averageRate); getRest > 0; getRest--) {
		ratedHTMLstars += '<span class="full"></span>'
	}
	return ratedHTMLstars
}

function getRateStarHTML(averageRate) {
	const tempAverageRate = beforeGetRateStar(averageRate)
	let averageRateHTML
	if(tempAverageRate.boolZero === true) {
		averageRateHTML = getZeroRateStar()
	} else {
		averageRateHTML = getRateStar(tempAverageRate.data)
	}
	return averageRateHTML
}

module.exports = { checkLAuthorised, isLoggedin, isNull, isNotNull, isAuthor, mustHaveParameters,
	isZeroSizeOfImage, flagCheckAnswer, flagCheckQuestionAuthor, getRateAverage, getRateStarHTML }
