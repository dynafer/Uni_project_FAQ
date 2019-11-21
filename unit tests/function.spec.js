/*eslint linebreak-style: ["error", "windows"]*/

'use strict'

const func = require('../function/function.general'),
	ufunc = require('../function/function.user'),
	afunc = require('../function/function.answer')


describe('GeneralFunction()', () => {

	test('checkLAuthorised()', async done => {
		expect.assertions(4)
		expect(func.checkLAuthorised(true)).toBe(true)
		expect(func.checkLAuthorised(false)).toBe(false)
		expect(func.checkLAuthorised(null)).toBe(false)
		expect(func.checkLAuthorised(undefined)).toBe(false)
		done()
	})

	test('isLoggedin()', async done => {
		expect.assertions(4)
		expect(func.isLoggedin(1)).toBe(true)
		try {
			func.isLoggedin(0)
		} catch(err) {
			expect(err).toEqual( new Error('You don\'t login yet') )
		}
		try {
			func.isLoggedin(null)
		} catch(err) {
			expect(err).toEqual( new Error('You don\'t login yet') )
		}
		try {
			func.isLoggedin(undefined)
		} catch(err) {
			expect(err).toEqual( new Error('You don\'t login yet') )
		}
		done()
	})

	test('isNull()', async done => {
		expect.assertions(5)
		expect(func.isNull(0, 0)).toBe(true)
		expect(func.isNull(null, null)).toBe(true)
		expect(func.isNull(undefined, undefined)).toBe(true)
		expect(func.isNull(1, 1)).toBe(false)
		expect(func.isNull('t', 1)).toBe(false)
		done()
	})

	test('isNotNull()', async done => {
		expect.assertions(5)
		expect(func.isNotNull(1, 1)).toBe(true)
		expect(func.isNotNull('t', 1)).toBe(true)
		expect(func.isNotNull(0, 0)).toBe(false)
		expect(func.isNotNull(null, null)).toBe(false)
		expect(func.isNotNull(undefined, undefined)).toBe(false)
		done()
	})

	test('mustHaveParameters()', async done => {
		expect.assertions(5)
		expect(func.mustHaveParameters([
			{variable: 1, numberOrlength: 1},
			{variable: 2, numberOrlength: 2},
			{variable: 5, numberOrlength: 3}
		])).toBe(true)
		try {
			func.mustHaveParameters([ {variablesssss: 1, numberOrlength: 1} ])
		} catch(err) {
			expect(err).toEqual( new Error('Access in a wrong way') )
		}
		try {
			func.mustHaveParameters([ {numberOrlengthssss: 1} ])
		} catch(err) {
			expect(err).toEqual( new Error('Access in a wrong way') )
		}
		try {
			func.mustHaveParameters([ {variable: undefined, numberOrlength: 0} ])
		} catch(err) {
			expect(err).toEqual( new Error('Access in a wrong way') )
		}
		try {
			func.mustHaveParameters()
		} catch(err) {
			expect(err).toEqual( new Error('Access in a wrong way') )
		}
		done()
	})

	test('isZeroSizeOfImage()', async done => {
		expect.assertions(2)
		expect(func.isZeroSizeOfImage(4123)).toBe(1)
		expect(func.isZeroSizeOfImage(0)).toBe(0)
		done()
	})

})

describe('UserFunction()', () => {

	test('checkRegisterInputValid()', async done => {
		expect.assertions(4)
		try {
			ufunc.checkRegisterInputValid({user: '', pass: 'test', pass2: 'test'})
		} catch(err) {
			expect(err).toEqual( new Error('missing username') )
		}
		try {
			ufunc.checkRegisterInputValid({user: 'test', pass: '', pass2: 'test'})
		} catch(err) {
			expect(err).toEqual( new Error('missing password') )
		}
		try {
			ufunc.checkRegisterInputValid({user: 'test', pass: 'test', pass2: ''})
		} catch(err) {
			expect(err).toEqual( new Error('missing confirm password') )
		}
		try {
			ufunc.checkRegisterInputValid({user: 'test', pass: 'test1', pass2: 'test2'})
		} catch(err) {
			expect(err).toEqual( new Error('confirm password is different from password') )
		}
		done()
	})

	test('getAUserRank()', async done => {
		expect.assertions(4)
		const testusers = [
				{id: 1, contribution: 150},
				{id: 2, contribution: 130},
				{id: 3, contribution: 120},
				{id: 4, contribution: 50}
			],
			userid1 = 1, userid2 = 2, userid3 = 3, userid4 = 4
		expect(ufunc.getAUserRank(testusers, userid1)).toBe('goldStar')
		expect(ufunc.getAUserRank(testusers, userid2)).toBe('silverStar')
		expect(ufunc.getAUserRank(testusers, userid3)).toBe('bronzeStar')
		expect(ufunc.getAUserRank(testusers, userid4)).toBe('noStar')
		done()
	})

})
