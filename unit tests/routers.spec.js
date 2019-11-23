
'use strict'

const request = require('supertest'),
	session = require('supertest-session'),
	server = require('../index'),
	sqlite = require('sqlite-async'),
	fs = require('fs')

describe('UserRouter()', () => {
	test('GET /', async done => {
		expect.assertions(4)
		const response = await request(server).get('/')
		expect(response.status).toBe(200)
		expect(response.statusCode).toBe(200)
		expect(response.ok).toBe(true)
		expect(response.text.includes('An Error Has Occurred')).toBe(false)
		done()
	})

	test('GET /register', async done => {
		expect.assertions(4)
		const response = await request(server).get('/register')
		expect(response.status).toBe(200)
		expect(response.statusCode).toBe(200)
		expect(response.ok).toBe(true)
		expect(response.text.includes('An Error Has Occurred')).toBe(false)
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
		expect.assertions(4)
		const response = await request(server).get('/login')
		expect(response.status).toBe(200)
		expect(response.statusCode).toBe(200)
		expect(response.ok).toBe(true)
		expect(response.text.includes('An Error Has Occurred')).toBe(false)
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
		expect.assertions(4)
		const response = await request(server).get('/ranking')
		expect(response.status).toBe(200)
		expect(response.statusCode).toBe(200)
		expect(response.ok).toBe(true)
		expect(response.text.includes('An Error Has Occurred')).toBe(false)
		done()
	})

})

describe('FAQRouter()', () => {

	const sessionserver = session(server)
	let loggedin

	beforeAll((done) => {
		sessionserver.post('/login')
			.send('user=test')
			.send('pass=test')
			.expect(302)
			.end(async() => {
				loggedin = sessionserver
				return done()
			})
	})

	test('GET /list with an empty list', async done => {
		expect.assertions(4)
		const response = await loggedin.get('/list')
		expect(response.status).toBe(200)
		expect(response.statusCode).toBe(200)
		expect(response.ok).toBe(true)
		expect(response.text.includes('An Error Has Occurred')).toBe(false)
		done()
	})

	test('GET /writeQuestion', async done => {
		expect.assertions(4)
		const response = await loggedin.get('/writeQuestion')
		expect(response.status).toBe(200)
		expect(response.statusCode).toBe(200)
		expect(response.ok).toBe(true)
		expect(response.text.includes('An Error Has Occurred')).toBe(false)
		done()
	})

	test('POST /writeQuestion with an empty picture', async done => {
		expect.assertions(2)
		const response = await loggedin.post('/writeQuestion')
			.field('title', 'This is the first test')
			.field('description', 'This is a description')
			.attach('image', './unit tests/assets/image/testSizezero.png')
		expect(response.status).toBe(302)
		expect(response.redirect).toBe(true)
		done()
	})

	test('POST /writeQuestion with a picture', async done => {
		expect.assertions(2)
		const response = await loggedin.post('/writeQuestion')
			.field('title', 'This is the second test')
			.field('description', 'This is a description')
			.attach('image', './unit tests/assets/image/testPicture.png')
		expect(response.status).toBe(302)
		expect(response.redirect).toBe(true)
		done()
	})

	test('POST /writeQuestion error', async done => {
		expect.assertions(1)
		const response = await loggedin.post('/writeQuestion')
			.field('title', '')
		expect(response.text.includes('An Error Has Occurred')).toBe(true)
		done()
	})

	test('GET /faq/:id([0-9]{1,}) without answers', async done => {
		expect.assertions(4)
		const response = await loggedin.get('/faq/2')
		expect(response.status).toBe(200)
		expect(response.statusCode).toBe(200)
		expect(response.ok).toBe(true)
		expect(response.text.includes('An Error Has Occurred')).toBe(false)
		done()
	})

	test('GET /faq/:id([0-9]{1,}) with answers', async done => {
		expect.assertions(4)
		await loggedin.post('/faq/1')
			.field('answerInput', 'This%20is%20a%20description')
		const response = await loggedin.get('/faq/1')
		expect(response.status).toBe(200)
		expect(response.statusCode).toBe(200)
		expect(response.ok).toBe(true)
		expect(response.text.includes('An Error Has Occurred')).toBe(false)
		done()
	})

	test('GET /faq/:id([0-9]{1,}) error', async done => {
		expect.assertions(1)
		const response = await loggedin.get('/faq/4')
		expect(response.text.includes('An Error Has Occurred')).toBe(true)
		done()
	})

	test('GET /FullImage/:id([0-9]{1,})', async done => {
		expect.assertions(4)
		const response = await loggedin.get('/FullImage/2?type=png')
		expect(response.status).toBe(200)
		expect(response.statusCode).toBe(200)
		expect(response.ok).toBe(true)
		expect(response.text.includes('An Error Has Occurred')).toBe(false)
		done()
	})

	test('GET /FullImage/:id([0-9]{1,}) error', async done => {
		expect.assertions(1)
		const response = await loggedin.get('/FullImage/2')
		expect(response.text.includes('An Error Has Occurred')).toBe(true)
		done()
	})

	test('POST /faq/:id([0-9]{1,}) write answer', async done => {
		expect.assertions(2)
		await loggedin.destroy()
		await sessionserver.post('/login')
			.send('user=test1')
			.send('pass=test1')
			.expect(302)
			.then(loggedin = sessionserver)
		const response = await loggedin.post('/faq/2')
			.field('answerInput', 'This%20is%20a%20description')
		expect(response.status).toBe(302)
		expect(response.redirect).toBe(true)
		done()
	})

	test('POST /faq/:id([0-9]{1,}) write answer error', async done => {
		expect.assertions(1)
		const response = await loggedin.post('/faq/2')
			.field('answerInput', '')
		expect(response.text.includes('An Error Has Occurred')).toBe(true)
		done()
	})

	test('GET /faq/:id([0-9]{1,})/:answerid([0-9]{1,})/:flagtype([0-9]{1,}) solved', async done => {
		expect.assertions(2)
		await loggedin.post('/faq/1')
			.field('answerInput', 'This%20is%20a%20description')
		await loggedin.destroy()
		await sessionserver.post('/login')
			.send('user=test')
			.send('pass=test')
			.expect(302)
			.then(loggedin = sessionserver)
		const response = await loggedin.get('/faq/2/2/1')
		expect(response.status).toBe(302)
		expect(response.redirect).toBe(true)
		done()
	})

	test('GET /faq/:id([0-9]{1,})/:answerid([0-9]{1,})/:flagtype([0-9]{1,}) inappropriate', async done => {
		expect.assertions(2)
		const response = await loggedin.get('/faq/1/3/2')
		expect(response.status).toBe(302)
		expect(response.redirect).toBe(true)
		done()
	})

	test('GET /faq/:id([0-9]{1,})/:answerid([0-9]{1,})/:flagtype([0-9]{1,}) error', async done => {
		expect.assertions(1)
		const response = await loggedin.get('/faq/2/5/1')
		expect(response.text.includes('An Error Has Occurred')).toBe(true)
		done()
	})

	test('GET /faq/:id([0-9]{1,})/:answerid([0-9]{1,}) rate an answer', async done => {
		expect.assertions(2)
		const response = await loggedin.get('/faq/2/2?rate=4')
		expect(response.status).toBe(302)
		expect(response.redirect).toBe(true)
		done()
	})

	test('GET /faq/:id([0-9]{1,})/:answerid([0-9]{1,}) rate an answer error', async done => {
		expect.assertions(1)
		const response = await loggedin.get('/faq/2/2?rate=6')
		expect(response.text.includes('An Error Has Occurred')).toBe(true)
		done()
	})

	test('GET /list with at least one question', async done => {
		expect.assertions(4)
		const response = await loggedin.get('/list')
		expect(response.status).toBe(200)
		expect(response.statusCode).toBe(200)
		expect(response.ok).toBe(true)
		expect(response.text.includes('An Error Has Occurred')).toBe(false)
		done()
	})

	afterAll(async() => {
		await server.close(server.removeAllListeners())
		const db = await sqlite.open('website.db')
		await db.run('DROP TABLE users;')
		await db.run('DROP TABLE questions;')
		await db.run('DROP TABLE questionThumbnails;')
		await db.run('DROP TABLE answers;')
		await db.run('DROP TABLE answersRate;')
		fs.unlinkSync('public/avatars/test1.png')
		fs.unlinkSync('public/upload/FAQ/2.png')
	})
})
