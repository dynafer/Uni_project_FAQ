
'use strict'

const fs = require('fs-extra'),
	mime = require('mime-types'),
	sqlite = require('sqlite-async'),
	jimp = require('jimp'),
	func = require('../function/function.general')

module.exports = class FAQ {
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const question = `CREATE TABLE IF NOT EXISTS questions (id INTEGER PRIMARY KEY AUTOINCREMENT,
				title TEXT, description TEXT, solved INTEGER(1) DEFAULT 0, authorId INTEGER(100),
				createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP, imageBool INTEGER(1), imageType TEXT);`
			await this.db.run(question)
			const thumbnail = `CREATE TABLE IF NOT EXISTS questionThumbnails (
				id INTEGER PRIMARY KEY AUTOINCREMENT, faqId INTEGER(100), encoded TEXT);`
			await this.db.run(thumbnail)
			const answer = `CREATE TABLE IF NOT EXISTS answers (
				id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, flagged INTEGER(2) DEFAULT 0,
				faqId INTEGER(100), authorId INTEGER(100), createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`
			await this.db.run(answer)
			const answerRate = `CREATE TABLE IF NOT EXISTS answersRate (id INTEGER PRIMARY KEY AUTOINCREMENT,
				userId INTEGER(100), answerId INTEGER(100), rate INTEGER(5));`
			await this.db.run(answerRate)
			return this
		})()
	}

	async getQuestions(query) {
		let sql, records
		if(query.faqId === undefined) {
			sql = 'SELECT * FROM questions ORDER BY id DESC'
			records = await this.db.all(sql)
		} else {
			sql = 'SELECT * FROM questions WHERE id = ?'
			records = await this.db.all(sql, query.faqId)
		}
		if(records === undefined || records.length === 0) return {nolist: true}
		return records
	}

	async newQuestion(query) {
		try {
			func.mustHaveParameters([
				{variable: query.author, numberOrlength: query.author}
			])
			const imageTypeLength = query.imageType ? query.imageType.length : 0
			if(func.isNotNull(query.imageType, imageTypeLength)) {
				query.imageType = mime.extension(query.imageType)
			}
			const sql = `INSERT INTO questions(title, description, authorId, imageBool, imageType) 
											VALUES(?, ?, ?, ?, ?)`
			await this.db.run(sql, query.title, query.description, query.author, query.imageBool, query.imageType)
			return true
		} catch(err) {
			throw err
		}
	}

	async uploadPicture(query) {
		const extension = mime.extension(query.type)
		await fs.copy(query.path, `public/upload/FAQ/${query.listid}.${extension}`)
		let encodedData
		const readImage = await jimp.read(`public/upload/FAQ/${query.listid}.${extension}`)
		const widthSize = 300, heightSize = 300, quality = 90
		await readImage.resize(widthSize, heightSize)
		await readImage.quality(quality)
		readImage.getBase64(jimp.AUTO , (e, img64) => {
			encodedData = img64
		})
		const sql = 'INSERT INTO questionThumbnails(faqId, encoded) VALUES(?, ?)'
		await this.db.run(sql, query.listid, encodedData)
	}

	async QuestionThumbnail(query) {
		try {
			const imageSql = 'SELECT encoded FROM questionThumbnails WHERE faqId = ?'
			const getData = await this.db.get(imageSql, query.id)
			if(!getData) throw Error('The thumbnail doesn\'t not exist')
			return getData.encoded
		} catch (err) {
			throw err
		}
	}

	async getAnswers(query) {
		let sql, records
		if(query.id === undefined) {
			sql = 'SELECT * FROM answers WHERE faqId = ? ORDER BY id ASC'
			records = await this.db.all(sql, query.faqId)
		} else {
			sql = 'SELECT * FROM answers WHERE id = ? ORDER BY id DESC'
			records = await this.db.all(sql, query.id)
		}
		if(records === undefined || records.length === 0) return {nolist: true}
		return records
	}

	async newAnswer(query) {
		try {
			const descriptionLength = query.description ? query.description.length : 0
			func.mustHaveParameters([
				{variable: query.description, numberOrlength: descriptionLength},
				{variable: query.faqId, numberOrlength: query.faqId},
				{variable: query.author, numberOrlength: query.author}
			])
			const sql = 'INSERT INTO answers(description, faqId, authorId) VALUES(?, ?, ?)'
			await this.db.run(sql, query.description, query.faqId, query.author)
			return true
		} catch(err) {
			throw err
		}
	}

	async flagAnswer(query) {
		try {
			func.mustHaveParameters([
				{variable: query.flagtype, numberOrlength: query.flagtype},
				{variable: query.answerId, numberOrlength: query.answerId}
			])
			const sql = 'UPDATE answers SET flagged = ? WHERE id = ?'
			await this.db.run(sql, query.flagtype, query.answerId)
			if(query.flagtype === 1) {
				const sql2 = `UPDATE questions SET solved = 1 WHERE id = ${query.faqId}`
				await this.db.run(sql2)
			}
			return true
		} catch(err) {
			throw err
		}
	}

	async getAnswerRates(query) {
		let sql, records
		if(query.userId === undefined) {
			sql = 'SELECT * FROM answersRate WHERE answerId = ? ORDER BY id DESC'
			records = await this.db.all(sql, query.answerId)
		} else {
			sql = 'SELECT * FROM answersRate WHERE userId = ? AND answerId = ? ORDER BY id DESC'
			records = await this.db.all(sql, query.userId, query.answerId)
		}
		if(records === undefined || records.length === 0) return {nolist: true}
		return records
	}

	async newRate(query) {
		try {
			func.mustHaveParameters([
				{variable: query.sessionId, numberOrlength: query.sessionId},
				{variable: query.answerId, numberOrlength: query.answerId},
				{variable: query.rate, numberOrlength: query.rate}
			])
			const sql = 'INSERT INTO answersRate(userId, answerId, rate) VALUES(?, ?, ?)'
			await this.db.run(sql, query.sessionId, query.answerId, query.rate)
			return true
		} catch(err) {
			throw err
		}
	}
}
