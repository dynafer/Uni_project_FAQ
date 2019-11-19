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

module.exports = { isLoggedin, isZeroSizeOfImage, isNotNull, getRateAverage, getRateStarHTML }
