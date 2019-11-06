
'use strict'

const fs = require('fs')

// Question Service
const QuestionListService = require('../services/QuestionServices/QuestionListService')
const NewQuestionService = require('../services/QuestionServices/NewQuestionService')
const UploadPictureService = require('../services/QuestionServices/UploadPictureService')
const DetailQuestionService = require('../services/QuestionServices/DetailQuestionService')

// Answer Services
var AnswerListService = require('../services/AnswerServices/AnswerListService')
var NewAnswerService = require('../services/AnswerServices/NewAnswerService')
var FlagAnswerService = require('../services/AnswerServices/FlagAnswerService')
var RateAnswerService = require('../services/AnswerServices/RateAnswerService')


/**
 * Question Services Unit Testing
 */
describe('questionList()', () => {

	test('get an empty list', async done => {
		expect.assertions(1)
		const list = await QuestionListService.getQuestions({})
		expect(list.nolist).toBe(true)
		done()
    })

    test('get a list', async done => {
        expect.assertions(3)
        await NewQuestionService.newQuestion({author: 1, title: "test", description: "test", imageBool: 0, imageType: ""})
        const list = await QuestionListService.getQuestions({})

        expect(list.nolist).toBe(undefined)
        expect(list[0].id).toBe(1)
        expect(list[0].authorId).toBe(1)
        done()
    })

    test('get a specific list with the question id', async done => {
        expect.assertions(2)
        const list = await QuestionListService.getQuestions({faqId: 1})
        expect(list.nolist).toBe(undefined)
        expect(list[0].id).toBe(1)
        done()
    })

    test('no specific question found', async done => {
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



/**
 * Answer Services Unit Testing
 */
describe('answerList()', () => {

	test('get an empty answer list', async done => {
		expect.assertions(1)
        const list = await AnswerListService.getAnswers({faqId: 1})
        expect(list.nolist).toBe(true)
		done()
    })

    test('get a list', async done => {
        expect.assertions(2)
        await NewAnswerService.newAnswer({author: 5, faqId: 1, description: "test"})
        const list = await AnswerListService.getAnswers({faqId: 1})
        expect(list.nolist).toBe(undefined)
        expect(list[0].id).toBe(1)
        done()
    })

    test('get a specific answer with the answer id', async done => {
        expect.assertions(3)
        const list = await AnswerListService.getAnswers({id: 1})
        expect(list.nolist).toBe(undefined)
        expect(list[0].id).toBe(1)
        expect(list[0].authorId).toBe(5)
        done()
    })

    test('no specific answer found', async done => {
        expect.assertions(1)
        await NewAnswerService.newAnswer({author: 5, faqId: 1, description: "test"})
        const list = await AnswerListService.getAnswers({id: 0})
		expect(list.nolist).toBe(true)
        done()
    })
    
})

describe('newAnswer()', () => {

	test('Add a new answer with valid credentials', async done => {
		expect.assertions(1)
		const valid = await NewAnswerService.newAnswer({author: 3, faqId: 2, description: "test"})
		expect(valid).toBe(true)
		done()
    })

    test('error if attempts without login', async done => {
        expect.assertions(3)
		await expect( NewAnswerService.newAnswer({author: 0, faqId: 2, description: "test"}) )
			.rejects.toEqual( Error(`You don't login yet`) )
		await expect( NewAnswerService.newAnswer({author: null, faqId: 2, description: "test"}) )
			.rejects.toEqual( Error(`You don't login yet`) )
		await expect( NewAnswerService.newAnswer({faqId: 2, description: "test"}) )
			.rejects.toEqual( Error(`You don't login yet`) )
        done()
    })

    test('error if attempts without a specific question id', async done => {
        expect.assertions(3)
		await expect( NewAnswerService.newAnswer({author: 3, faqId: 0, description: "test"}) )
			.rejects.toEqual( Error(`You accessed in a wrong way`) )
		await expect( NewAnswerService.newAnswer({author: 3, faqId: null, description: "test"}) )
			.rejects.toEqual( Error(`You accessed in a wrong way`) )
		await expect( NewAnswerService.newAnswer({author: 3, description: "test"}) )
			.rejects.toEqual( Error(`You accessed in a wrong way`) )
        done()
    })

    test('error if black description', async done => {
        expect.assertions(1)
		await expect( NewAnswerService.newAnswer({author: 3, faqId: 2, description: ""}) )
			.rejects.toEqual( Error(`missing description`) )
        done()
    })

    test('error if the question is solved', async done => {
        expect.assertions(1)
        await FlagAnswerService.flagAnswer({faqId: 1, sessionId: 1, answerId: 1, flagtype: 1})
		await expect( NewAnswerService.newAnswer({author: 4, faqId: 1, description: "test"}) )
			.rejects.toEqual( Error(`Already Solved`) )
        done()
    })

})

describe('flagAnswer()', () => {

	test('flag as an inappropriate answer with valid credentials', async done => {
        expect.assertions(1)
        await NewQuestionService.newQuestion({author: 6, title: "test", description: "test", imageBool: 0, imageType: ""})
        await NewAnswerService.newAnswer({author: 4, faqId: 4, description: "test"})
		const valid = await FlagAnswerService.flagAnswer({faqId: 4, sessionId: 6, answerId: 4, flagtype: 2})
		expect(valid).toBe(true)
		done()
    })

	test('flag as an proper answer with valid credentials', async done => {
        expect.assertions(1)
        await NewAnswerService.newAnswer({author: 4, faqId: 4, description: "test"})
		const valid = await FlagAnswerService.flagAnswer({faqId: 4, sessionId: 6, answerId: 5, flagtype: 1})
		expect(valid).toBe(true)
		done()
    })

    test('error if attempts without login', async done => {
        expect.assertions(3)
        await NewQuestionService.newQuestion({author: 2, title: "test", description: "test", imageBool: 0, imageType: ""})
        await NewAnswerService.newAnswer({author: 3, faqId: 5, description: "test"})
		await expect( FlagAnswerService.flagAnswer({faqId: 5, sessionId: 0, answerId: 6, flagtype: 1}) )
			.rejects.toEqual( Error(`You don't login yet`) )
		await expect( FlagAnswerService.flagAnswer({faqId: 5, sessionId: null, answerId: 6, flagtype: 1}) )
			.rejects.toEqual( Error(`You don't login yet`) )
		await expect( FlagAnswerService.flagAnswer({faqId: 5, answerId: 6, flagtype: 1}) )
			.rejects.toEqual( Error(`You don't login yet`) )
        done()
    })

    test('error if attempts without the specific question id', async done => {
        expect.assertions(3)
		await expect( FlagAnswerService.flagAnswer({faqId: 0, sessionId: 2, answerId: 6, flagtype: 1}) )
			.rejects.toEqual( Error(`Access in a wrong way`) )
		await expect( FlagAnswerService.flagAnswer({faqId: null, sessionId: 2, answerId: 6, flagtype: 1}) )
			.rejects.toEqual( Error(`Access in a wrong way`) )
		await expect( FlagAnswerService.flagAnswer({sessionId: 2, answerId: 2, flagtype: 1}) )
			.rejects.toEqual( Error(`Access in a wrong way`) )
        done()
    })

    test('error if attempts without the specific answer id', async done => {
        expect.assertions(3)
		await expect( FlagAnswerService.flagAnswer({faqId: 5, sessionId: 2, answerId: 0, flagtype: 1}) )
			.rejects.toEqual( Error(`Access in a wrong way`) )
		await expect( FlagAnswerService.flagAnswer({faqId: 5, sessionId: 2, answerId: null, flagtype: 1}) )
			.rejects.toEqual( Error(`Access in a wrong way`) )
		await expect( FlagAnswerService.flagAnswer({faqId: 5, sessionId: 2, flagtype: 1}) )
			.rejects.toEqual( Error(`Access in a wrong way`) )
        done()
    })

    test('error if attempts without flagtype', async done => {
        expect.assertions(3)
		await expect( FlagAnswerService.flagAnswer({faqId: 5, sessionId: 2, answerId: 6, flagtype: 0}) )
			.rejects.toEqual( Error(`Access in a wrong way`) )
		await expect( FlagAnswerService.flagAnswer({faqId: 5, sessionId: 2, answerId: 6, flagtype: null}) )
			.rejects.toEqual( Error(`Access in a wrong way`) )
		await expect( FlagAnswerService.flagAnswer({faqId: 5, sessionId: 2, answerId: 6}) )
			.rejects.toEqual( Error(`Access in a wrong way`) )
        done()
    })

    test('error if the question does not exist', async done => {
        expect.assertions(1)
		await expect( FlagAnswerService.flagAnswer({faqId: 55123512, sessionId: 2, answerId: 6, flagtype: 1}) )
			.rejects.toEqual( Error(`No Question found`) )
        done()
    })

    test('error if user but not a question poster attempts', async done => {
        expect.assertions(1)
		await expect( FlagAnswerService.flagAnswer({faqId: 5, sessionId: 3, answerId: 6, flagtype: 1}) )
			.rejects.toEqual( Error(`No permission`) )
        done()
    })

    test('error if the question is solved', async done => {
        expect.assertions(1)
		await expect( FlagAnswerService.flagAnswer({faqId: 4, sessionId: 6, answerId: 4, flagtype: 1}) )
			.rejects.toEqual( Error(`Already Solved`) )
        done()
    })

    test('error if the question id is different the answer question id', async done => {
        expect.assertions(1)
        await NewQuestionService.newQuestion({author: 1, title: "test", description: "test", imageBool: 0, imageType: ""})
        await NewAnswerService.newAnswer({author: 4, faqId: 6, description: "test"})
		await expect( FlagAnswerService.flagAnswer({faqId: 5, sessionId: 2, answerId: 7, flagtype: 1}) )
			.rejects.toEqual( Error(`Access in a wrong way`) )
        done()
    })

    test('error if the answer was flagged', async done => {
        expect.assertions(1)
        await FlagAnswerService.flagAnswer({faqId: 6, sessionId: 1, answerId: 7, flagtype: 2})
		await expect( FlagAnswerService.flagAnswer({faqId: 6, sessionId: 1, answerId: 7, flagtype: 1}) )
			.rejects.toEqual( Error(`Already Flagged`) )
        done()
    })

    test('error if the answer poster is the same as the logged in user', async done => {
        expect.assertions(1)
        await NewAnswerService.newAnswer({author: 1, faqId: 6, description: "test"})
		await expect( FlagAnswerService.flagAnswer({faqId: 6, sessionId: 1, answerId: 8, flagtype: 1}) )
			.rejects.toEqual( Error(`Can't flag your own answer`) )
        done()
    })

})

describe('rateAnswer()', () => {

	test('rate an answer with valid credentials', async done => {
        expect.assertions(1)
		const valid = await RateAnswerService.rateAnswer({sessionId: 2, answerId: 8, rate: 5})
		expect(valid).toBe(true)
		done()
    })

    test('error if attempts without login', async done => {
        expect.assertions(3)
		await expect( RateAnswerService.rateAnswer({sessionId: 0, answerId: 6, rate: 5}) )
			.rejects.toEqual( Error(`You don't login yet`) )
		await expect( RateAnswerService.rateAnswer({sessionId: null, answerId: 6, rate: 5}) )
			.rejects.toEqual( Error(`You don't login yet`) )
		await expect( RateAnswerService.rateAnswer({answerId: 6, rate: 5}) )
			.rejects.toEqual( Error(`You don't login yet`) )
        done()
    })

    test('error if attempts without the answer id', async done => {
        expect.assertions(3)
		await expect( RateAnswerService.rateAnswer({sessionId: 1, answerId: 0, rate: 5}) )
			.rejects.toEqual( Error(`Access in a wrong way`) )
		await expect( RateAnswerService.rateAnswer({sessionId: 1, answerId: null, rate: 5}) )
			.rejects.toEqual( Error(`Access in a wrong way`) )
		await expect( RateAnswerService.rateAnswer({sessionId: 1, rate: 5}) )
			.rejects.toEqual( Error(`Access in a wrong way`) )
        done()
    })

    test('error if attempts without rate or higher than 5 or lower than 1', async done => {
        expect.assertions(4)
		await expect( RateAnswerService.rateAnswer({sessionId: 1, answerId: 6, rate: null}) )
			.rejects.toEqual( Error(`Error to rate`) )
		await expect( RateAnswerService.rateAnswer({sessionId: 1, answerId: 6}) )
			.rejects.toEqual( Error(`Error to rate`) )
		await expect( RateAnswerService.rateAnswer({sessionId: 1, answerId: 6, rate: 0.5}) )
			.rejects.toEqual( Error(`Error to rate`) )
		await expect( RateAnswerService.rateAnswer({sessionId: 1, answerId: 6, rate: 5.5}) )
			.rejects.toEqual( Error(`Error to rate`) )
        done()
    })

    test('error if the answer does not exist', async done => {
        expect.assertions(1)
		await expect( RateAnswerService.rateAnswer({sessionId: 1, answerId: 5618234, rate: 3}) )
			.rejects.toEqual( Error(`No Answer found`) )
        done()
    })

    test('error if the answer poster is same as the logged in user', async done => {
        expect.assertions(1)
		await expect( RateAnswerService.rateAnswer({sessionId: 3, answerId: 6, rate: 3}) )
			.rejects.toEqual( Error(`Can't rate your own answer`) )
        done()
    })

    test('error if rate the rated answer again by one user', async done => {
		expect.assertions(1)
		await RateAnswerService.rateAnswer({sessionId: 1, answerId: 6, rate: 5})
		await expect( RateAnswerService.rateAnswer({sessionId: 1, answerId: 6, rate: 3}) )
			.rejects.toEqual( Error(`Already Rated`) )
        done()
    })

})