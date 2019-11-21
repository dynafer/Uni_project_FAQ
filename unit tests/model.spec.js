/*eslint linebreak-style: ["error", "windows"]*/

'use strict'

const User = require('../models/User'),
	FAQ = require('../models/FAQ'),
	dbName = 'website.db'

/**
 *  This unit testing will handle only uncovered line on models after testing others
 */


// User Model
beforeAll(async() => {
	const RegisterService = require('../services/UserServices/RegisterService')
	await RegisterService.register({user: 'doej', pass: 'password', pass2: 'password'})
})

describe('UserConstructor()', () => {
	test('constructor', async done => {
		expect.assertions(1)
		const user = await new User(dbName)
		expect(user.db.filename).toBe('website.db')
		done()
	})

	test('constructor without dbname', async done => {
		expect.assertions(1)
		const user = await new User()
		expect(user.db.filename).toBe(':memory:')
		done()
	})
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

//FAQ Model
describe('FAQConstructor()', () => {
	test('constructor', async done => {
		expect.assertions(1)
		const faq = await new FAQ(dbName)
		expect(faq.db.filename).toBe('website.db')
		done()
	})

	test('constructor without dbname', async done => {
		expect.assertions(1)
		const faq = await new FAQ()
		expect(faq.db.filename).toBe(':memory:')
		done()
	})
})

describe('newQuestion()', () => {
	test('error if the user did not login', async done => {
		expect.assertions(1)
		const faq = await new FAQ(dbName)
		await expect(faq.newQuestion({title: 'test', description: 'test', imageBool: 0, imageType: ''}))
			.rejects.toEqual( Error('Access in a wrong way') )
		done()
	})
})

describe('QuestionThumbnail()', () => {
	test('error if specific question thumbnail does not exist', async done => {
		expect.assertions(1)
		const faq = await new FAQ(dbName)
		await expect(faq.QuestionThumbnail({id: 174921}))
			.rejects.toEqual( Error('The thumbnail doesn\'t not exist') )
		done()
	})
})

describe('newAnswer()', () => {
	test('error if attempts without description, faq id or session id', async done => {
		expect.assertions(3)
		const faq = await new FAQ(dbName)
		await expect(faq.newAnswer({faqId: 1, author: 1}))
			.rejects.toEqual( Error('Access in a wrong way') )
		await expect(faq.newAnswer({description: 'test', faqId: 1}))
			.rejects.toEqual( Error('Access in a wrong way') )
		await expect(faq.newAnswer({description: 'test', author: 1}))
			.rejects.toEqual( Error('Access in a wrong way') )
		done()
	})
})

describe('flagAnswer()', () => {
	test('error if attempts without flag type or answer id', async done => {
		expect.assertions(2)
		const faq = await new FAQ(dbName)
		await expect(faq.flagAnswer({flagtype: 1}))
			.rejects.toEqual( Error('Access in a wrong way') )
		await expect(faq.flagAnswer({answerId: 1}))
			.rejects.toEqual( Error('Access in a wrong way') )
		done()
	})
})

describe('newRate()', () => {
	test('error if attempts without session id, answer id or rate', async done => {
		expect.assertions(3)
		const faq = await new FAQ(dbName)
		await expect(faq.newRate({answerId: 1, rate: 3.5}))
			.rejects.toEqual( Error('Access in a wrong way') )
		await expect(faq.newRate({sessionId: 1, rate: 3.5}))
			.rejects.toEqual( Error('Access in a wrong way') )
		await expect(faq.newRate({sessionId: 1, answerId: 1}))
			.rejects.toEqual( Error('Access in a wrong way') )
		done()
	})
})

afterAll(async() => {
	const sqlite = require('sqlite-async')
	const db = await sqlite.open('website.db')
	await db.run('DROP TABLE users;')
	await db.run('DROP TABLE questions;')
	await db.run('DROP TABLE questionThumbnails;')
	await db.run('DROP TABLE answers;')
	await db.run('DROP TABLE answersRate;')
})
