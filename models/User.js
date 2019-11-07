
'use strict'

const bcrypt = require('bcrypt-promise')
const fs = require('fs-extra')
const mime = require('mime-types')
const sqlite = require('sqlite-async')
const saltRounds = 10

module.exports = class User {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = 'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, pass TEXT, contribution INTEGER(100));'
			await this.db.run(sql)
			return this
		})()
    }

    async getUsers(query) {
        var sql, records
        if((query.username === undefined || query.username.length === 0) && (query.userid === undefined || query.userid === 0) && query.contribution === undefined) {
			throw Error("Parameter Error")
        } else {
			var query_condition
			if(query.username !== undefined && query.username.length !== 0) {
				query_condition = `WHERE user="${query.username}"`
			} else if(query.userid !== undefined && query.userid !== 0) {
				query_condition = `WHERE id="${query.userid}"`
			} else if(query.contribution === true) {
				query_condition = `ORDER BY contribution DESC`
			}
			sql = `SELECT * FROM users ${query_condition};`
			records = await this.db.all(sql)
        }
        return records
    }

	async register(query) {
		try {
			query.pass = await bcrypt.hash(query.pass, saltRounds)
			let sql = `INSERT INTO users(user, pass, contribution) VALUES("${query.user}", "${query.pass}", 0)`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}

	async uploadPicture(files) {
		const extension = mime.extension(files.type)
		await fs.copy(files.path, `public/avatars/${files.user}.${extension}`)
	}
    
    async login(query) {
		try {
			let sql = `SELECT id, pass FROM users WHERE user = "${query.user}";`
			const record = await this.db.get(sql)
			const valid = await bcrypt.compare(query.pass, record.pass)
			return {authorised: valid, userid: record.id}
		} catch(err) {
			throw err
		}
	}
	
	async contribute(query) {
		try {
			const sql = `UPDATE users SET contribution = ${query.contribution} WHERE id = ${query.userId}`
            await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}
}