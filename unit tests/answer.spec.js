
'use strict'

const sqlite = require('sqlite-async'),

	// User Services
	RegisterService = require('../services/UserServices/RegisterService'),

	// Question Services
	NewQuestionService = require('../services/QuestionServices/NewQuestionService'),

	// Answer Services
	AnswerListService = require('../services/AnswerServices/AnswerListService'),
	NewAnswerService = require('../services/AnswerServices/NewAnswerService'),
	FlagAnswerService = require('../services/AnswerServices/FlagAnswerService'),
	RateAnswerService = require('../services/AnswerServices/RateAnswerService')

/**
 * Answer Services Unit Testing
 */

beforeAll(async() => {
	await RegisterService.register({user: 'doej', pass: 'password', pass2: 'password'})
	await RegisterService.register({user: 'doej1', pass: 'password', pass2: 'password'})
	await RegisterService.register({user: 'doej2', pass: 'password', pass2: 'password'})
	await RegisterService.register({user: 'doej3', pass: 'password', pass2: 'password'})
	await RegisterService.register({user: 'doej4', pass: 'password', pass2: 'password'})
})

describe('answerList()', () => {

	beforeAll(async() => {
		await NewQuestionService.newQuestion({author: 1, title: 'test', description: 'test', imageBool: 0})
	})

	afterAll(async() => {
		const db = await sqlite.open('website.db')
		await db.run('DROP TABLE questions;')
		await db.run('DROP TABLE questionThumbnails;')
		await db.run('DROP TABLE answers;')
		await db.run('DROP TABLE answersRate;')
	})

	test('get an empty answer list', async done => {
		expect.assertions(1)
		const list = await AnswerListService.getAnswers({faqId: 1})
		expect(list.nolist).toBe(true)
		done()
	})

	test('get a list', async done => {
		expect.assertions(3)
		await NewAnswerService.newAnswer({author: 1, faqId: 1, description: 'test'})
		const list = await AnswerListService.getAnswers({faqId: 1})
		expect(list.nolist).toBe(undefined)
		expect(list[0].id).toBe(1)
		expect(list[0].sessionid).toBe(undefined)
		done()
	})

	test('get a list after authentication', async done => {
		expect.assertions(3)
		const list = await AnswerListService.getAnswers({faqId: 1, sessionid: 1})
		expect(list.nolist).toBe(undefined)
		expect(list[0].id).toBe(1)
		expect(list[0].sessionid).toBe(1)
		done()
	})

	test('get a list with average rating', async done => {
		expect.assertions(4)
		await RateAnswerService.rateAnswer({sessionId: 2, answerId: 1, rate: 2.5})
		const list = await AnswerListService.getAnswers({faqId: 1, sessionid: 1}),
		    tempResult = '<span class="full checked"></span><span class="full checked"></span>' +
                        '<span class="half checked"></span><span class="full"></span>' +
                        '<span class="full"></span><span class="full"></span>'
		expect(list.nolist).toBe(undefined)
		expect(list[0].id).toBe(1)
		expect(list[0].sessionid).toBe(1)
		expect(list[0].averageRate).toBe(tempResult)
		done()
	})

	test('error if the question does not exist', async done => {
		expect.assertions(1)
		await NewQuestionService.newQuestion({author: 1, title: 'test', description: 'test', imageBool: 0})
		await NewAnswerService.newAnswer({author: 1, faqId: 2, description: 'test'})
		const db = await sqlite.open('website.db')
		db.run('DELETE FROM questions WHERE id = 2')
		await expect( AnswerListService.getAnswers({faqId: 2}) )
			.rejects.toEqual( Error('The question doesn\'t exist') )
		done()
	})

	test('get a specific answer with the answer id', async done => {
		expect.assertions(3)
		await NewAnswerService.newAnswer({author: 5, faqId: 1, description: 'test'})
		const list = await AnswerListService.getAnswers({id: 3})
		expect(list.nolist).toBe(undefined)
		expect(list[0].id).toBe(3)
		expect(list[0].authorId).toBe(5)
		done()
	})

	test('no specific answer found', async done => {
		expect.assertions(1)
		const list = await AnswerListService.getAnswers({id: 0})
		expect(list.nolist).toBe(true)
		done()
	})

})

describe('newAnswer()', () => {

	beforeAll(async() => {
		await NewQuestionService.newQuestion({author: 1, title: 'test', description: 'test', imageBool: 0})
	})

	afterAll(async() => {
		const db = await sqlite.open('website.db')
		await db.run('DROP TABLE questions;')
		await db.run('DROP TABLE questionThumbnails;')
		await db.run('DROP TABLE answers;')
		await db.run('DROP TABLE answersRate;')
	})

	test('Add a new answer with valid credentials', async done => {
		expect.assertions(1)
		const valid = await NewAnswerService.newAnswer({author: 3, faqId: 1, description: 'test'})
		expect(valid).toBe(true)
		done()
	})

	test('error if attempts without login', async done => {
		expect.assertions(3)
		await expect( NewAnswerService.newAnswer({author: 0, faqId: 1, description: 'test'}) )
			.rejects.toEqual( Error('You don\'t login yet') )
		await expect( NewAnswerService.newAnswer({author: null, faqId: 1, description: 'test'}) )
			.rejects.toEqual( Error('You don\'t login yet') )
		await expect( NewAnswerService.newAnswer({faqId: 1, description: 'test'}) )
			.rejects.toEqual( Error('You don\'t login yet') )
		done()
	})

	test('error if attempts without a specific question id', async done => {
		expect.assertions(3)
		await expect( NewAnswerService.newAnswer({author: 3, faqId: 0, description: 'test'}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		await expect( NewAnswerService.newAnswer({author: 3, faqId: null, description: 'test'}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		await expect( NewAnswerService.newAnswer({author: 3, description: 'test'}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		done()
	})

	test('error if black description', async done => {
		expect.assertions(3)
		await expect( NewAnswerService.newAnswer({author: 3, faqId: 1, description: ''}) )
			.rejects.toEqual( Error('missing description') )
		await expect( NewAnswerService.newAnswer({author: 3, faqId: 1, description: null}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		await expect( NewAnswerService.newAnswer({author: 3, faqId: 1}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		done()
	})

	test('error if the question is solved', async done => {
		expect.assertions(1)
		await NewAnswerService.newAnswer({author: 3, faqId: 1, description: 'test'})
		await FlagAnswerService.flagAnswer({faqId: 1, sessionId: 1, answerId: 2, flagtype: 1})
		await expect( NewAnswerService.newAnswer({author: 4, faqId: 1, description: 'test'}) )
			.rejects.toEqual( Error('Already Solved') )
		done()
	})

	test('error if the question does not exist', async done => {
		expect.assertions(1)
		await expect( NewAnswerService.newAnswer({author: 3, faqId: 5172934, description: 'test'}) )
			.rejects.toEqual( Error('No Question found') )
		done()
	})

})

describe('flagAnswer()', () => {

	beforeAll(async() => {
		await NewQuestionService.newQuestion({author: 1, title: 'test', description: 'test', imageBool: 0})
		await NewQuestionService.newQuestion({author: 2, title: 'test', description: 'test', imageBool: 0})
		await NewQuestionService.newQuestion({author: 3, title: 'test', description: 'test', imageBool: 0})
		await NewAnswerService.newAnswer({author: 2, faqId: 1, description: 'test'})
		await NewAnswerService.newAnswer({author: 3, faqId: 1, description: 'test'})
		await NewAnswerService.newAnswer({author: 1, faqId: 2, description: 'test'})
		await NewAnswerService.newAnswer({author: 4, faqId: 2, description: 'test'})
		await NewAnswerService.newAnswer({author: 5, faqId: 3, description: 'test'})
		await NewAnswerService.newAnswer({author: 3, faqId: 3, description: 'test'})
	})

	afterAll(async() => {
		const db = await sqlite.open('website.db')
		await db.run('DROP TABLE questions;')
		await db.run('DROP TABLE questionThumbnails;')
		await db.run('DROP TABLE answers;')
		await db.run('DROP TABLE answersRate;')
	})

	test('flag as an inappropriate answer with valid credentials', async done => {
		expect.assertions(1)
		const valid = await FlagAnswerService.flagAnswer({faqId: 2, sessionId: 2, answerId: 4, flagtype: 2})
		expect(valid).toBe(true)
		done()
	})

	test('flag as an proper answer with valid credentials', async done => {
		expect.assertions(1)
		const valid = await FlagAnswerService.flagAnswer({faqId: 1, sessionId: 1, answerId: 2, flagtype: 1})
		expect(valid).toBe(true)
		done()
	})

	test('error if attempts without login', async done => {
		expect.assertions(3)
		await expect( FlagAnswerService.flagAnswer({faqId: 2, sessionId: 0, answerId: 3, flagtype: 1}) )
			.rejects.toEqual( Error('You don\'t login yet') )
		await expect( FlagAnswerService.flagAnswer({faqId: 2, sessionId: null, answerId: 3, flagtype: 1}) )
			.rejects.toEqual( Error('You don\'t login yet') )
		await expect( FlagAnswerService.flagAnswer({faqId: 2, answerId: 3, flagtype: 1}) )
			.rejects.toEqual( Error('You don\'t login yet') )
		done()
	})

	test('error if attempts without the specific question id', async done => {
		expect.assertions(3)
		await expect( FlagAnswerService.flagAnswer({faqId: 0, sessionId: 2, answerId: 3, flagtype: 1}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		await expect( FlagAnswerService.flagAnswer({faqId: null, sessionId: 2, answerId: 3, flagtype: 1}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		await expect( FlagAnswerService.flagAnswer({sessionId: 2, answerId: 3, flagtype: 1}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		done()
	})

	test('error if attempts without the specific answer id', async done => {
		expect.assertions(3)
		await expect( FlagAnswerService.flagAnswer({faqId: 2, sessionId: 2, answerId: 0, flagtype: 1}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		await expect( FlagAnswerService.flagAnswer({faqId: 2, sessionId: 2, answerId: null, flagtype: 1}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		await expect( FlagAnswerService.flagAnswer({faqId: 2, sessionId: 2, flagtype: 1}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		done()
	})

	test('error if attempts without flagtype', async done => {
		expect.assertions(3)
		await expect( FlagAnswerService.flagAnswer({faqId: 2, sessionId: 2, answerId: 3, flagtype: 0}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		await expect( FlagAnswerService.flagAnswer({faqId: 2, sessionId: 2, answerId: 3, flagtype: null}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		await expect( FlagAnswerService.flagAnswer({faqId: 2, sessionId: 2, answerId: 3}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		done()
	})

	test('error if the question does not exist', async done => {
		expect.assertions(1)
		await expect( FlagAnswerService.flagAnswer({faqId: 123512, sessionId: 1, answerId: 1, flagtype: 1}) )
			.rejects.toEqual( Error('No Question found') )
		done()
	})

	test('error if user but not a question poster attempts', async done => {
		expect.assertions(1)
		await expect( FlagAnswerService.flagAnswer({faqId: 2, sessionId: 3, answerId: 3, flagtype: 1}) )
			.rejects.toEqual( Error('No permission') )
		done()
	})

	test('error if the question is solved', async done => {
		expect.assertions(1)
		await expect( FlagAnswerService.flagAnswer({faqId: 1, sessionId: 1, answerId: 1, flagtype: 2}) )
			.rejects.toEqual( Error('Already Solved') )
		done()
	})

	test('error if the question id is different the answer question id', async done => {
		expect.assertions(1)
		await expect( FlagAnswerService.flagAnswer({faqId: 3, sessionId: 3, answerId: 3, flagtype: 1}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		done()
	})

	test('error if the anser does not exist', async done => {
		expect.assertions(1)
		await expect( FlagAnswerService.flagAnswer({faqId: 3, sessionId: 3, answerId: 57213571, flagtype: 1}) )
			.rejects.toEqual( Error('No Answer found') )
		done()
	})

	test('error if the answer was flagged', async done => {
		expect.assertions(1)
		await expect( FlagAnswerService.flagAnswer({faqId: 2, sessionId: 2, answerId: 4, flagtype: 1}) )
			.rejects.toEqual( Error('Already Flagged') )
		done()
	})

	test('error if the answer poster is the same as the logged in user', async done => {
		expect.assertions(1)
		await expect( FlagAnswerService.flagAnswer({faqId: 3, sessionId: 3, answerId: 6, flagtype: 1}) )
			.rejects.toEqual( Error('Can\'t flag your own answer') )
		done()
	})

})

describe('rateAnswer()', () => {

	beforeAll(async() => {
		await NewQuestionService.newQuestion({author: 1, title: 'test', description: 'test', imageBool: 0})
		await NewAnswerService.newAnswer({author: 1, faqId: 1, description: 'test'})
		await NewAnswerService.newAnswer({author: 2, faqId: 1, description: 'test'})
		await NewAnswerService.newAnswer({author: 3, faqId: 1, description: 'test'})
	})

	test('rate an answer with valid credentials', async done => {
		expect.assertions(1)
		const valid = await RateAnswerService.rateAnswer({sessionId: 2, answerId: 1, rate: 5})
		expect(valid).toBe(true)
		done()
	})

	test('error if attempts without login', async done => {
		expect.assertions(3)
		await expect( RateAnswerService.rateAnswer({sessionId: 0, answerId: 2, rate: 5}) )
			.rejects.toEqual( Error('You don\'t login yet') )
		await expect( RateAnswerService.rateAnswer({sessionId: null, answerId: 2, rate: 5}) )
			.rejects.toEqual( Error('You don\'t login yet') )
		await expect( RateAnswerService.rateAnswer({answerId: 2, rate: 5}) )
			.rejects.toEqual( Error('You don\'t login yet') )
		done()
	})

	test('error if attempts without the answer id', async done => {
		expect.assertions(3)
		await expect( RateAnswerService.rateAnswer({sessionId: 1, answerId: 0, rate: 5}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		await expect( RateAnswerService.rateAnswer({sessionId: 1, answerId: null, rate: 5}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		await expect( RateAnswerService.rateAnswer({sessionId: 1, rate: 5}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		done()
	})

	test('error if attempts without rate or higher than 5 or lower than 1', async done => {
		expect.assertions(4)
		await expect( RateAnswerService.rateAnswer({sessionId: 1, answerId: 2, rate: null}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		await expect( RateAnswerService.rateAnswer({sessionId: 1, answerId: 2}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		await expect( RateAnswerService.rateAnswer({sessionId: 1, answerId: 2, rate: 0.5}) )
			.rejects.toEqual( Error('Error to rate') )
		await expect( RateAnswerService.rateAnswer({sessionId: 1, answerId: 2, rate: 5.5}) )
			.rejects.toEqual( Error('Error to rate') )
		done()
	})

	test('error if the answer does not exist', async done => {
		expect.assertions(1)
		await expect( RateAnswerService.rateAnswer({sessionId: 1, answerId: 5618234, rate: 3}) )
			.rejects.toEqual( Error('No Answer found') )
		done()
	})

	test('error if the answer poster is same as the logged in user', async done => {
		expect.assertions(1)
		await expect( RateAnswerService.rateAnswer({sessionId: 3, answerId: 3, rate: 3}) )
			.rejects.toEqual( Error('Can\'t rate your own answer') )
		done()
	})

	test('error if rate the rated answer again by the same user', async done => {
		expect.assertions(1)
		await RateAnswerService.rateAnswer({sessionId: 1, answerId: 3, rate: 5})
		await expect( RateAnswerService.rateAnswer({sessionId: 1, answerId: 3, rate: 3}) )
			.rejects.toEqual( Error('Already Rated') )
		done()
	})

})

afterAll(async() => {
	const db = await sqlite.open('website.db')
	await db.run('DROP TABLE users;')
	await db.run('DROP TABLE questions;')
	await db.run('DROP TABLE questionThumbnails;')
	await db.run('DROP TABLE answers;')
	await db.run('DROP TABLE answersRate;')
})
