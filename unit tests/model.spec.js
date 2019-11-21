/*eslint linebreak-style: ["error", "windows"]*/

'use strict'

const User = require('../models/User')

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
		const user = await new User('website.db')
		await expect(user.getUsers({}))
			.rejects.toEqual( Error('Access in a wrong way') )
		done()
	})
})


afterAll(async() => {
	const sqlite = require('sqlite-async')
	const db = await sqlite.open('website.db')
	await db.run('DROP TABLE users;')
})
