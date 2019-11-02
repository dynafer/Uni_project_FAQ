
'use strict'

const sqlite = require('sqlite-async')

module.exports = class FAQ {
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS questions (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, solved INTEGER(1) DEFAULT 0, authorId INTEGER(100), createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP, imageBool INTEGER(1), imageType TEXT);'
			await this.db.run(sql)
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
}