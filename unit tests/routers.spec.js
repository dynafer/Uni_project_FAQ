
'use strict'

const request = require('supertest'),
	server = require('../index'),
	sqlite = require('sqlite-async'),
	fs = require('fs')

describe('UserRouter()', () => {
	test('GET /', async done => {
		expect.assertions(3)
		const response = await request(server).get('/')
		expect(response.status).toBe(200)
		expect(response.statusCode).toBe(200)
		expect(response.ok).toBe(true)
		done()
	})

	test('GET /register', async done => {
		expect.assertions(3)
		const response = await request(server).get('/register')
		expect(response.status).toBe(200)
		expect(response.statusCode).toBe(200)
		expect(response.ok).toBe(true)
		done()
	})

	test('POST /register with an empty avatar', async done => {
		expect.assertions(2)
		const response = await request(server).post('/register')
			.field('user', 'test')
			.field('pass', 'test')
			.field('pass2', 'test')
			.attach('avatar', './unit tests/assets/image/testSizezero.png')
		expect(response.status).toBe(302)
		expect(response.redirect).toBe(true)
		done()
	})

	test('POST /register with a normal avatar', async done => {
		expect.assertions(2)
		const response = await request(server).post('/register')
			.field('user', 'test1')
			.field('pass', 'test1')
			.field('pass2', 'test1')
			.attach('avatar', './unit tests/assets/image/testAvatar.png')
		expect(response.status).toBe(302)
		expect(response.redirect).toBe(true)
		done()
	})

	test('POST /register error', async done => {
		expect.assertions(1)
		const response = await request(server).post('/register')
			.field('user', 'test')
		expect(response.text.includes('An Error Has Occurred')).toBe(true)
		done()
	})

	test('GET /login', async done => {
		expect.assertions(3)
		const response = await request(server).get('/login')
		expect(response.status).toBe(200)
		expect(response.statusCode).toBe(200)
		expect(response.ok).toBe(true)
		done()
	})

	test('POST /login', async done => {
		expect.assertions(2)
		const response = await request(server).post('/login')
			.send('user=test')
			.send('pass=test')
		expect(response.status).toBe(302)
		expect(response.redirect).toBe(true)
		done()
	})

	test('POST /login error', async done => {
		expect.assertions(1)
		const response = await request(server).post('/login')
			.send('user=testtest')
		expect(response.text.includes('An Error Has Occurred')).toBe(true)
		done()
	})

	test('GET /logout', async done => {
		expect.assertions(2)
		const response = await request(server).get('/logout')
		expect(response.status).toBe(302)
		expect(response.redirect).toBe(true)
		done()
	})

	test('GET /ranking', async done => {
		expect.assertions(3)
		const response = await request(server).get('/ranking')
		expect(response.status).toBe(200)
		expect(response.statusCode).toBe(200)
		expect(response.ok).toBe(true)
		done()
	})

	afterAll(async() => {
		await server.close(server.removeAllListeners())
		const db = await sqlite.open('website.db')
		await db.run('DROP TABLE users;')
		fs.unlinkSync('public/avatars/test1.png')
	})

})
