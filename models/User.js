/*eslint linebreak-style: ["error", "windows"]*/

'use strict'

const bcrypt = require('bcrypt-promise')
const fs = require('fs-extra')
const mime = require('mime-types')
const sqlite = require('sqlite-async')
const func = require('../function/function.general')
const saltRounds = 10

module.exports = class User {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,
				user TEXT, pass TEXT, contribution INTEGER(100));`
			await this.db.run(sql)
			return this
		})()
	}

	async getUsers(query) {
		let queryCondition
		const usernameLength = query.username ? query.username.length : 0
		if(func.isNotNull(query.username, usernameLength)) {
			queryCondition = `WHERE user="${query.username}"`
		} else if(func.isNotNull(query.userid, query.userid)) {
			queryCondition = `WHERE id="${query.userid}"`
		} else if(func.isNotNull(query.contribution, 1)) {
			queryCondition = 'ORDER BY contribution DESC'
		} else {
			throw Error('Access in a wrong way')
		}
		const sql = `SELECT * FROM users ${queryCondition};`
		const records = await this.db.all(sql)
		return records
	}

	async register(query) {
		try {
			query.pass = await bcrypt.hash(query.pass, saltRounds)
			const sql = 'INSERT INTO users(user, pass, contribution) VALUES(?, ?, ?)'
			await this.db.run(sql, query.user, query.pass, 0)
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
			const sql = 'SELECT id, pass FROM users WHERE user = ?;'
			const record = await this.db.get(sql, query.user)
			const valid = await bcrypt.compare(query.pass, record.pass)
			return {authorised: valid, userid: record.id}
		} catch(err) {
			throw err
		}
	}

	async contribute(query) {
		try {
			let sql = 'SELECT id, pass FROM users WHERE id = ?;'
			const record = await this.db.get(sql, query.userId)
			const recordLength = record ? record.length : 0
			if(func.isNull(record, recordLength)) throw Error('Access in a wrong way')
			sql = 'UPDATE users SET contribution = ? WHERE id = ?'
			await this.db.run(sql, query.contribution, query.userId)
			return true
		} catch(err) {
			throw err
		}
	}
}
