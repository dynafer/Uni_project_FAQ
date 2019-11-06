
'use strict'

const fs = require('fs')

// Question Service
const QuestionListService = require('../services/QuestionServices/QuestionListService')
const NewQuestionService = require('../services/QuestionServices/NewQuestionService')
const UploadPictureService = require('../services/QuestionServices/UploadPictureService')
const DetailQuestionService = require('../services/QuestionServices/DetailQuestionService')

describe('questionList()', () => {

	test('get an empty list', async done => {
		expect.assertions(1)
		const list = await QuestionListService.getQuestions({})
		expect(list.nolist).toBe(true)
		done()
    })

    test('get a list', async done => {
        expect.assertions(2)
        await NewQuestionService.newQuestion({author: 1, title: "test", description: "test", imageBool: 0, imageType: ""})
        const list = await QuestionListService.getQuestions({})

        expect(list.nolist).toBe(undefined)
        expect(list[0].id).toBe(1)
        done()
    })

    test('get a specific list with the question id', async done => {
        expect.assertions(2)
        const list = await QuestionListService.getQuestions({faqId: 1})
        expect(list.nolist).toBe(undefined)
        expect(list[0].id).toBe(1)
        done()
    })

    test('no question found', async done => {
        expect.assertions(1)
        await NewQuestionService.newQuestion({author: 1, title: "test2", description: "test2", imageBool: 0})
        const list = await QuestionListService.getQuestions({faqId: 0})
		expect(list.nolist).toBe(true)
        done()
    })
})

describe('newQuestion()', () => {

	test('Add a new question with valid credentials', async done => {
		expect.assertions(1)
		const valid = await NewQuestionService.newQuestion({author: 1, title: "test", description: "test", imageBool: 0})
		expect(valid).toBe(true)
		done()
    })

    test('error if attempts without login', async done => {
        expect.assertions(3)
		await expect( NewQuestionService.newQuestion({author: 0, title: "test", description: "test", imageBool: 0}) )
			.rejects.toEqual( Error(`You don't login yet`) )
		await expect( NewQuestionService.newQuestion({author: null, title: "test", description: "test", imageBool: 0}) )
			.rejects.toEqual( Error(`You don't login yet`) )
		await expect( NewQuestionService.newQuestion({title: "test", description: "test", imageBool: 0}) )
			.rejects.toEqual( Error(`You don't login yet`) )
        done()
    })

    test('error if black title', async done => {
        expect.assertions(1)
		await expect( NewQuestionService.newQuestion({author: 1, title: "", description: "test", imageBool: 0}) )
			.rejects.toEqual( Error(`missing title`) )
        done()
    })

    test('error if black description', async done => {
        expect.assertions(1)
		await expect( NewQuestionService.newQuestion({author: 1, title: "test", description: "", imageBool: 0}) )
			.rejects.toEqual( Error(`missing description`) )
        done()
    })

})

describe('uploadPicture()', () => {

	test('upload a valid picture with username', async done => {
		expect.assertions(1)
		const uploaded = await UploadPictureService.uploadPicture({path:'public/avatars/avatar.png', type:'image/png', listid: 1})
		expect(uploaded).toBe()
		done()
    })
    
	test('Error if upload a picture without listid', async done => {
		expect.assertions(3)
		await expect( UploadPictureService.uploadPicture({path:'public/avatars/avatar.png', type:'image/png', listid:0}) )
			.rejects.toEqual( Error('Error during uploading') )
		await expect( UploadPictureService.uploadPicture({path:'public/avatars/avatar.png', type:'image/png', listid:null}) )
			.rejects.toEqual( Error('Error during uploading') )
		await expect( UploadPictureService.uploadPicture({path:'public/avatars/avatar.png', type:'image/png'}) )
			.rejects.toEqual( Error('Error during uploading') )
		done()
	})

	afterAll(async () => {
        fs.unlinkSync('public/upload/FAQ/1.png')
        fs.rmdirSync('public/upload/FAQ')
        fs.rmdirSync('public/upload')
    })
    
})

describe('detailQuestion()', () => {

	test('get a question detail with valid credentials', async done => {
		expect.assertions(3)
		const detail = await DetailQuestionService.detailsQuestion({faqId: 1})
		expect(detail.id).toBe(1)
		expect(detail.title).toBe("test")
		expect(detail.description).toBe("test")
		done()
    })
    
	test('Error if get a question detail without valid faqId', async done => {
		expect.assertions(3)
		await expect( DetailQuestionService.detailsQuestion({faqId: 0}) )
			.rejects.toEqual( Error(`Error during getting information of the question`) )
		await expect( DetailQuestionService.detailsQuestion({faqId: null}) )
			.rejects.toEqual( Error(`Error during getting information of the question`) )
		await expect( DetailQuestionService.detailsQuestion({}) )
			.rejects.toEqual( Error(`Error during getting information of the question`) )
		done()
	})
    
	test('Error if the question does not exist', async done => {
		expect.assertions(1)
		await expect( DetailQuestionService.detailsQuestion({faqId: 57238174}) )
			.rejects.toEqual( Error(`Can't find the question`) )
		done()
	})
    
})