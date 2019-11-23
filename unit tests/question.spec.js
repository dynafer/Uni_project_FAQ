
'use strict'

const fs = require('fs'),
	sqlite = require('sqlite-async'),

	// User Services
	RegisterService = require('../services/UserServices/RegisterService'),

	// Question Services
	QuestionListService = require('../services/QuestionServices/QuestionListService'),
	NewQuestionService = require('../services/QuestionServices/NewQuestionService'),
	UploadPictureService = require('../services/QuestionServices/UploadPictureService'),
	DetailQuestionService = require('../services/QuestionServices/DetailQuestionService')

/**
 * Question Services Unit Testing
 */

beforeAll(async() => {
	await RegisterService.register({user: 'doej', pass: 'password', pass2: 'password'})
})

describe('questionList()', () => {

	afterAll(async() => {
		const db = await sqlite.open('website.db')
		await db.run('DROP TABLE questions;')
		await db.run('DROP TABLE questionThumbnails;')
		await db.run('DROP TABLE answers;')
		await db.run('DROP TABLE answersRate;')
	})

	test('get an empty list', async done => {
		expect.assertions(1)
		const list = await QuestionListService.getQuestions({})
		expect(list.nolist).toBe(true)
		done()
	})

	test('get a list', async done => {
		expect.assertions(3)
		await NewQuestionService.newQuestion({
			author: 1, title: 'test', description: 'test', imageBool: 0, imageType: ''
		})
		const list = await QuestionListService.getQuestions({})
		expect(list.nolist).toBe(undefined)
		expect(list[0].id).toBe(1)
		expect(list[0].authorId).toBe(1)
		done()
	})

	test('get a specific list with the question id', async done => {
		expect.assertions(2)
		await NewQuestionService.newQuestion({
			author: 1, title: 'test', description: 'test', imageBool: 0, imageType: ''
		})
		const list = await QuestionListService.getQuestions({faqId: 2})
		expect(list.nolist).toBe(undefined)
		expect(list[0].id).toBe(2)
		done()
	})

	test('no specific question found', async done => {
		expect.assertions(1)
		const list = await QuestionListService.getQuestions({faqId: 0})
		expect(list.nolist).toBe(true)
		done()
	})
})

describe('newQuestion()', () => {

	afterAll(async() => {
		const db = await sqlite.open('website.db')
		await db.run('DROP TABLE questions;')
		await db.run('DROP TABLE questionThumbnails;')
		await db.run('DROP TABLE answers;')
		await db.run('DROP TABLE answersRate;')
	})

	test('Add a new question with valid credentials', async done => {
		expect.assertions(1)
		const valid = await NewQuestionService.newQuestion({
			author: 1, title: 'test', description: 'test', imageBool: 0
		})
		expect(valid).toBe(true)
		done()
	})

	test('error if attempts without login', async done => {
		expect.assertions(3)
		await expect( NewQuestionService.newQuestion({author: 0, title: 'test', description: 'test', imageBool: 0}) )
			.rejects.toEqual( Error('You don\'t login yet') )
		await expect( NewQuestionService.newQuestion({author: null, title: 'test', description: 'test', imageBool: 0}) )
			.rejects.toEqual( Error('You don\'t login yet') )
		await expect( NewQuestionService.newQuestion({title: 'test', description: 'test', imageBool: 0}) )
			.rejects.toEqual( Error('You don\'t login yet') )
		done()
	})

	test('error if black title', async done => {
		expect.assertions(3)
		await expect( NewQuestionService.newQuestion({author: 1, title: '', description: 'test', imageBool: 0}) )
			.rejects.toEqual( Error('missing title') )
		await expect( NewQuestionService.newQuestion({author: 1, title: null, description: 'test', imageBool: 0}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		await expect( NewQuestionService.newQuestion({author: 1, description: 'test', imageBool: 0}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		done()
	})

	test('error if black description', async done => {
		expect.assertions(3)
		await expect( NewQuestionService.newQuestion({author: 1, title: 'test', description: '', imageBool: 0}) )
			.rejects.toEqual( Error('missing description') )
		await expect( NewQuestionService.newQuestion({author: 1, title: 'test', description: null, imageBool: 0}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		await expect( NewQuestionService.newQuestion({author: 1, title: 'test', imageBool: 0}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		done()
	})

})

describe('uploadPicture()', () => {

	test('upload a valid picture with list id', async done => {
		expect.assertions(1)
		await UploadPictureService.uploadPicture({
			path: 'unit tests/assets/image/testPicture.png', type: 'image/png', listid: 1
		})
		const valid = fs.existsSync('public/upload/FAQ/1.png')
		expect(valid).toBe(true)
		done()
	})

	test('Error if upload a picture without list id', async done => {
		expect.assertions(3)
		await expect( UploadPictureService.uploadPicture({
			path: 'unit tests/assets/image/testPicture.png', type: 'image/png', listid: 0
		}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		await expect( UploadPictureService.uploadPicture({
			path: 'unit tests/assets/image/testPicture.png', type: 'image/png', listid: null
		}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		await expect( UploadPictureService.uploadPicture({
			path: 'unit tests/assets/image/testPicture.png', type: 'image/png'
		}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		done()
	})

	afterAll(() => {
		fs.unlinkSync('public/upload/FAQ/1.png')
		fs.rmdirSync('public/upload/FAQ')
		fs.rmdirSync('public/upload')
	})

})

describe('detailQuestion()', () => {

	afterAll(async() => {
		const db = await sqlite.open('website.db')
		await db.run('DROP TABLE questions;')
		await db.run('DROP TABLE questionThumbnails;')
		await db.run('DROP TABLE answers;')
		await db.run('DROP TABLE answersRate;')
	})

	test('get a question detail with valid credentials', async done => {
		expect.assertions(3)
		await NewQuestionService.newQuestion({author: 1, title: 'test', description: 'test', imageBool: 0})
		const detail = await DetailQuestionService.detailsQuestion({faqId: 1})
		expect(detail.id).toBe(1)
		expect(detail.title).toBe('test')
		expect(detail.description).toBe('test')
		done()
	})

	test('get a question detail with image data', async done => {
		expect.assertions(4)
		await NewQuestionService.newQuestion({
			author: 1, title: 'test', description: 'test', imageBool: 1, imageType: 'png'
		})
		await UploadPictureService.uploadPicture({
			path: 'unit tests/assets/image/testPicture.png', type: 'image/png', listid: 2
		})
		fs.unlinkSync('public/upload/FAQ/2.png')
		fs.rmdirSync('public/upload/FAQ')
		fs.rmdirSync('public/upload')
		const detail = await DetailQuestionService.detailsQuestion({faqId: 2})
		expect(detail.id).toBe(2)
		expect(detail.title).toBe('test')
		expect(detail.description).toBe('test')
		expect(detail.imageBool).toBe(1)
		done()
	})

	test('Error if get a question detail without valid faqId', async done => {
		expect.assertions(3)
		await expect( DetailQuestionService.detailsQuestion({faqId: 0}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		await expect( DetailQuestionService.detailsQuestion({faqId: null}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		await expect( DetailQuestionService.detailsQuestion({}) )
			.rejects.toEqual( Error('Access in a wrong way') )
		done()
	})

	test('Error if the question does not exist', async done => {
		expect.assertions(1)
		await expect( DetailQuestionService.detailsQuestion({faqId: 57238174}) )
			.rejects.toEqual( Error('Can\'t find the question') )
		done()
	})

})

afterAll(async() => {
	const db = await sqlite.open('website.db')
	await db.run('DROP TABLE users;')
})
