
'use strict'

const fs = require('fs-extra')
const mime = require('mime-types')
const sqlite = require('sqlite-async')
const jimp = require('jimp')

module.exports = class FAQ {
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const question = 'CREATE TABLE IF NOT EXISTS questions (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, solved INTEGER(1) DEFAULT 0, authorId INTEGER(100), createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP, imageBool INTEGER(1), imageType TEXT);'
			await this.db.run(question)
			const thumbnail = 'CREATE TABLE IF NOT EXISTS questionThumbnails (id INTEGER PRIMARY KEY AUTOINCREMENT, faqId INTEGER(100), encoded TEXT);'
			await this.db.run(thumbnail)
			const answer = 'CREATE TABLE IF NOT EXISTS answers (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, flagged INTEGER(2) DEFAULT 0, faqId INTEGER(100), authorId INTEGER(100), createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP);'
			await this.db.run(answer)
			return this
		})()
	}

	async getQuestions(query) {
		try {
            var sql, records
            if(query.faqId === undefined) {
                sql = `SELECT * FROM questions ORDER BY id DESC`
                records = await this.db.all(sql)
            } else {
                sql = `SELECT * FROM questions WHERE id = ?`
                records = await this.db.all(sql, query.faqId)
            }
			if(records === undefined || records.length === 0) return {nolist: true};
			return records;
		} catch(err) {
			throw err
		}
    }

	async newQuestion(query) {
		try {
			if(query.imageType !== undefined) {
				query.imageType = mime.extension(query.imageType);
			}
            const sql = `INSERT INTO questions(title, description, authorId, imageBool, imageType) VALUES("${query.title}", "${query.description}", ${query.author}, ${query.imageBool}, "${query.imageType}")`
			await this.db.run(sql)
			return true
		} catch(err) {
			console.log(err)
			throw err
		}
	}

	async uploadPicture(query) {
		try {
			const extension = mime.extension(query.type)
			console.log(`path: ${query.path}`)
			console.log(`extension: ${extension}`)
			await fs.copy(query.path, `public/upload/FAQ/${query.listid}.${extension}`)
			var encodedData
			const readImage = await jimp.read(`public/upload/FAQ/${query.listid}.${extension}`)
			await readImage.resize(300, 300)
			await readImage.quality(90)
			readImage.getBase64(jimp.AUTO , function(e, img64){ encodedData = img64 })
			const sql = `INSERT INTO questionThumbnails(faqId, encoded) VALUES(${query.listid}, '${encodedData}')`
			await this.db.run(sql)
		} catch (err) {
			throw err
		}
    }
    
    async QuestionThumbnail(query) {
        try {
			const image_sql = `SELECT encoded FROM questionThumbnails WHERE faqId = ?`
			const getData = await this.db.get(image_sql, query.id)
			return getData.encoded
        } catch (err) {
            throw err
        }
    }

	async getAnswers(query) {
		try {
            var sql, records
            if(query.id === undefined) {
                sql = `SELECT * FROM answers WHERE faqId = ? ORDER BY id ASC`
                records = await this.db.all(sql, query.faqId)
            } else {
                sql = `SELECT * FROM answers WHERE id = ? ORDER BY id DESC`
                records = await this.db.all(sql, query.id)
            }
			if(records === undefined || records.length === 0) return {nolist: true};
			return records;
		} catch(err) {
			throw err
		}
    }

	async newAnswer(query) {
		try {
            const sql = `INSERT INTO answers(description, faqId, authorId) VALUES("${query.description}", ${query.faqId}, ${query.author})`
			await this.db.run(sql)
			return true
		} catch(err) {
			console.log(err)
			throw err
		}
    }
    
    async flagAnswer(query) {
		try {
            const sql = `UPDATE answers SET flagged = ${query.flagtype} WHERE id = ${query.answerId}`
            await this.db.run(sql)
            if(query.flagtype === 1) {
                const sql2 = `UPDATE questions SET solved = 1 WHERE id = ${query.faqId}`
                await this.db.run(sql2)
            }
			return true
		} catch(err) {
			console.log(err)
			throw err
		}
    }
}