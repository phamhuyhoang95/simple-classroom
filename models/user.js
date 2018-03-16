const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const config = require('../config')
const adapter = new FileSync(config.DB_PATH)
const db = low(adapter)
const shortid = require('shortid')

const {
    hashPassword
} = require('../helpers')
/**
 * create user with some user information
 * @param {*} username : email of user 
 * @param {*} password : password of user
 * @return {*} : success when user created , false if user exist
 */
function createUser(username, password) {
    const user = getUser(username)
    if (user) {
        throw new Error(`User ${username}  is exist !`)
    } else {
        const hash = hashPassword(password)
        db.get(config.DB_USER_PREFIX).push({
            id: shortid.generate(),
            username,
            hashPassword: hash
        }).write()
    }
}

/**
 * get user math with username
 * @param {*} username 
 */
function getUser(username) {
    let user = db.get(config.DB_USER_PREFIX).find(u => u.username === username).value()
    return user
}


module.exports = {
    createUser,
    getUser
}
