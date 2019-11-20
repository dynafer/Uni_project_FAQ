/*eslint linebreak-style: ["error", "windows"]*/

'use strict'

function checkRegisterInputValid(query) {
	if(query.user.length === 0) throw Error('missing username')
	if(query.pass.length === 0) throw Error('missing password')
	if(query.pass2.length === 0) throw Error('missing confirm password')
	if(query.pass !== query.pass2) throw Error('confirm password are incorrect')
}

function calculateRank(preUser, curUser, ranked, nextRank) {
	if(preUser === curUser) {
		nextRank = nextRank + 1
	} else if(nextRank !== 0) {
		ranked = ranked + nextRank
		nextRank = 0
	} else {
		ranked = ranked + 1
	}
	return {rank: ranked, next: nextRank}
}

function findAUserRank(allUsers, userid) {
	let ranked = 0, nextRank = 0
	for(const i = 0; i < allUsers.length; i ++) {
		if(i !== 0) {
			const {rank, next} = calculateRank(allUsers[i-1].contribution, allUsers[i].contribution, ranked, nextRank)
			ranked = rank
			nextRank = next
		} else {
			nextRank = 1
		}
		if(allUsers[i].id === userid) break
	}
	return ranked
}

function getAUserRank(allUsers, userid) {
	const goldPercent = 5, silverPercent = 25, bronzePercent = 50,
		allPercent = 100,
		gold = allUsers.length * goldPercent / allPercent,
		silver = allUsers.length * silverPercent / allPercent,
		bronze = allUsers.length * bronzePercent / allPercent
	const ranked = findAUserRank(allUsers, userid)
	if(ranked <= gold) return 'goldStar'
	if(ranked <= silver) return 'silverStar'
	if(ranked <= bronze) return 'bronzeStar'
	return 'noStar'
}

module.exports = { checkRegisterInputValid, getAUserRank }
