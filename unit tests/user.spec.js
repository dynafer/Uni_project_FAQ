
'use strict'

const fs = require('fs'),
	sqlite = require('sqlite-async'),

	RegisterService = require('../services/UserServices/RegisterService'),
	LoginService = require('../services/UserServices/LoginService'),
	UploadAvatarService = require('../services/UserServices/UploadAvatarService'),
	ContributeService = require('../services/UserServices/ContributeService'),
	ContributedRankingService = require('../services/UserServices/ContributedRankingService')

beforeAll(async() => {
	const db = await sqlite.open('website.db')
	const sql = `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,
		user TEXT, pass TEXT, contribution INTEGER(100));`
	await db.run(sql)
})

describe('register()', () => {

	afterAll(async() => {
		const db = await sqlite.open('website.db')
		await db.run('DROP TABLE users;')
	})

	test('register a valid account', async done => {
		expect.assertions(1)
		const register = await RegisterService.register({user: 'doej', pass: 'password', pass2: 'password'})
		expect(register).toBe(true)
		done()
	})

	test('register a duplicate username', async done => {
		expect.assertions(1)
		await RegisterService.register({user: 'doej1', pass: 'password', pass2: 'password'})
		await expect( RegisterService.register({user: 'doej1', pass: 'password', pass2: 'password'}) )
			.rejects.toEqual( Error('username "doej1" already in use') )
		done()
	})

	test('error if blank username', async done => {
		expect.assertions(1)
		await expect( RegisterService.register({user: '', pass: 'password', pass2: 'password'}) )
			.rejects.toEqual( Error('missing username') )
		done()
	})

	test('error if blank password', async done => {
		expect.assertions(1)
		await expect( RegisterService.register({user: 'doej', pass: '', pass2: 'password'}) )
			.rejects.toEqual( Error('missing password') )
		done()
	})

	test('error if blank confirm password', async done => {
		expect.assertions(1)
		await expect( RegisterService.register({user: 'doej', pass: 'password', pass2: ''}) )
			.rejects.toEqual( Error('missing confirm password') )
		done()
	})

	test('error if password and confirm password are different', async done => {
		expect.assertions(1)
		await expect( RegisterService.register({user: 'doej', pass: 'password1', pass2: 'password2'}) )
			.rejects.toEqual( Error('confirm password is different from password') )
		done()
	})

})

describe('uploadAvatar()', () => {

	test('upload a avatar with a valid username', async done => {
		expect.assertions(1)
		await UploadAvatarService.uploadAvatar({
			path: 'unit tests/assets/image/testAvatar.png', type: 'image/png', user: 'doej'
		})
		const valid = fs.existsSync('public/avatars/doej.png')
		expect(valid).toBe(true)
		done()
	})

	test('Error if upload a avatar without username', async done => {
		expect.assertions(3)
		await expect( UploadAvatarService.uploadAvatar({
			path: 'unit tests/assets/image/testAvatar.png', type: 'image/png', user: ''
		}) )
			.rejects.toEqual( Error('Error during uploading') )
		await expect( UploadAvatarService.uploadAvatar({
			path: 'unit tests/assets/image/testAvatar.png', type: 'image/png', user: null
		}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		await expect( UploadAvatarService.uploadAvatar({
			path: 'unit tests/assets/image/testAvatar.png', type: 'image/png'
		}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		done()
	})

	afterAll(async() => {
		const db = await sqlite.open('website.db')
		await db.run('DROP TABLE users;')
		fs.unlinkSync('public/avatars/doej.png')
	})

})

describe('login()', () => {

	beforeAll(async() => {
		await RegisterService.register({user: 'doej', pass: 'password', pass2: 'password'})
	})

	afterAll(async() => {
		const db = await sqlite.open('website.db')
		await db.run('DROP TABLE users;')
	})

	test('log in with valid credentials', async done => {
		expect.assertions(2)
		const valid = await LoginService.login({user: 'doej', pass: 'password'})
		expect(valid.authorised).toBe(true)
		expect(valid.userid).toBe(1)
		done()
	})

	test('invalid username', async done => {
		expect.assertions(1)
		await expect( LoginService.login({user: 'roej', pass: 'password'}) )
			.rejects.toEqual( Error('username "roej" not found') )
		done()
	})

	test('invalid password', async done => {
		expect.assertions(1)
		await expect( LoginService.login({user: 'doej', pass: 'bad'}) )
			.rejects.toEqual( Error('invalid password for account "doej"') )
		done()
	})

})

describe('contribute()', () => {

	beforeAll(async() => {
		await RegisterService.register({user: 'doej', pass: 'password', pass2: 'password'})
		await RegisterService.register({user: 'roej', pass: 'password', pass2: 'password'})
	})

	afterAll(async() => {
		const db = await sqlite.open('website.db')
		await db.run('DROP TABLE users;')
	})

	test('contribute with valid credentials', async done => {
		expect.assertions(2)
		const valid1 = await ContributeService.contribute({userId: 1, contribution: 50})
		const valid2 = await ContributeService.contribute({userId: 2, contribution: -5})
		expect(valid1).toBe(true)
		expect(valid2).toBe(true)
		done()
	})

	test('error if attempts without login', async done => {
		expect.assertions(3)
		await expect( ContributeService.contribute({userId: 0, contribution: -5}) )
			.rejects.toEqual( Error('You don\'t login yet') )
		await expect( ContributeService.contribute({userId: null, contribution: -5}) )
			.rejects.toEqual( Error('You don\'t login yet') )
		await expect( ContributeService.contribute({contribution: -5}) )
			.rejects.toEqual( Error('You don\'t login yet') )
		done()
	})

	test('error if the userid does not exist', async done => {
		expect.assertions(1)
		await expect( ContributeService.contribute({userId: 5123648231, contribution: -5}) )
			.rejects.toEqual( Error('Error during contributing') )
		done()
	})

})

describe('contributedranking()', () => {

	afterAll(async() => {
		const db = await sqlite.open('website.db')
		await db.run('DROP TABLE users;')
	})

	test('get a selected user contribution rank with valid credentials', async done => {
		expect.assertions(7)
		await RegisterService.register({user: 'doej', pass: 'password', pass2: 'password'})
		await RegisterService.register({user: 'doej1', pass: 'password', pass2: 'password'})
		await RegisterService.register({user: 'doej2', pass: 'password', pass2: 'password'})
		await RegisterService.register({user: 'doej3', pass: 'password', pass2: 'password'})
		await RegisterService.register({user: 'doej4', pass: 'password', pass2: 'password'})
		await RegisterService.register({user: 'doej5', pass: 'password', pass2: 'password'})
		await RegisterService.register({user: 'doej6', pass: 'password', pass2: 'password'})
		await ContributeService.contribute({userId: 1, contribution: 150})
		await ContributeService.contribute({userId: 2, contribution: 130})
		await ContributeService.contribute({userId: 3, contribution: 110})
		await ContributeService.contribute({userId: 4, contribution: 110})
		await ContributeService.contribute({userId: 5, contribution: 80})
		await ContributeService.contribute({userId: 6, contribution: 20})
		const valid1 = await ContributedRankingService.rankedContribute({userid: 1})
		const valid2 = await ContributedRankingService.rankedContribute({userid: 2})
		const valid3 = await ContributedRankingService.rankedContribute({userid: 3})
		const valid4 = await ContributedRankingService.rankedContribute({userid: 4})
		const valid5 = await ContributedRankingService.rankedContribute({userid: 5})
		const valid6 = await ContributedRankingService.rankedContribute({userid: 6})
		const valid7 = await ContributedRankingService.rankedContribute({userid: 7})
		expect(valid1).toBe('goldStar')
		expect(valid2).toBe('silverStar')
		expect(valid3).toBe('bronzeStar')
		expect(valid4).toBe('bronzeStar')
		expect(valid5).toBe('noStar')
		expect(valid6).toBe('noStar')
		expect(valid7).toBe('noStar')
		done()
	})

	test('invalid user id', async done => {
		expect.assertions(3)
		await expect( ContributedRankingService.rankedContribute({userid: 0}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		await expect( ContributedRankingService.rankedContribute({userid: null}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		await expect( ContributedRankingService.rankedContribute({}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		done()
	})

	test('error if the userid does not exist', async done => {
		expect.assertions(1)
		await expect( ContributedRankingService.rankedContribute({userid: 512361234512}) )
			.rejects.toEqual( Error('Error during getting information') )
		done()
	})

})
