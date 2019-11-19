/*eslint linebreak-style: ["error", "windows"]*/

'use strict'

const func = require('./function.general')

function flagCheckAnswer(flagAnswer, faqId, sessionid) {
	if(flagAnswer.nolist !== undefined) throw Error('No Answer found')
	if(flagAnswer[0].faqId !== faqId) throw Error('Access in a wrong way')
	if(flagAnswer[0].flagged !== 0) throw Error('Already Flagged')
	if(flagAnswer[0].authorId === sessionid) throw Error('Can\'t flag your own answer')
}

function flagCheckQuestionAuthor(checkAuthor, sessionid) {
	if(checkAuthor.nolist !== undefined) {
		throw Error('No Question found')
	}
	func.isAuthor(checkAuthor[0].authorId, sessionid)
	if(checkAuthor[0].solved !== 0) {
		throw Error('Already Solved')
	}
}

function rateCheckAnswer(getAnswer, sessionid) {
	if(getAnswer.nolist !== undefined) throw Error('No Answer found')
	if(getAnswer[0].authorId === sessionid) throw new Error('Can\'t rate your own answer')
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

module.exports = { flagCheckAnswer, flagCheckQuestionAuthor,
	rateCheckAnswer, getRateAverage, getRateStarHTML
}
