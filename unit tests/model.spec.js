/*eslint linebreak-style: ["error", "windows"]*/

'use strict'

const User = require('../models/User'),
	dbName = 'website.db'

/**
 *  This unit testing will handle only uncovered line on models after testing others
 *  In addition, not handle the codes following:
 *  catch(err) {
 *      throw err
 *  }
 */

beforeAll(async() => {
	const RegisterService = require('../services/UserServices/RegisterService')
	await RegisterService.register({user: 'doej', pass: 'password', pass2: 'password'})
})

describe('getUsers()', () => {
	test('error if use this method without any parameters', async done => {
		expect.assertions(1)
		const user = await new User(dbName)
		await expect(user.getUsers({}))
			.rejects.toEqual( Error('Access in a wrong way') )
		done()
	})
})

describe('register()', () => {
	test('error if attempts a empty query object', async done => {
		expect.assertions(1)
		const user = await new User(dbName)
		await expect(user.register({})).rejects.toEqual( Error('data and salt arguments required') )
		done()
	})
})

describe('login()', () => {
	test('error if attempts a empty query object', async done => {
		expect.assertions(1)
		const user = await new User(dbName)
		await expect(user.login({})).rejects.toEqual( Error('Cannot read property \'pass\' of undefined') )
		done()
	})

	test('error if there is no specific user', async done => {
		expect.assertions(1)
		const user = await new User(dbName)
		await expect(user.login({})).rejects.toEqual( Error('Cannot read property \'pass\' of undefined') )
		done()
	})
})

describe('contribute()', () => {
	test('error if there is no specific userid', async done => {
		expect.assertions(1)
		const user = await new User(dbName)
		await expect(user.contribute({userId: 537914, contribution: 50}))
			.rejects.toEqual( Error('Access in a wrong way') )
		done()
	})
})


afterAll(async() => {
	const sqlite = require('sqlite-async')
	const db = await sqlite.open('website.db')
	await db.run('DROP TABLE users;')
})
