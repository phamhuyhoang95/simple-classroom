const debug = require('debug')('simpleapp:middleware:secure')
const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../config')
const {
    getUser
} = require('../models/user')
function genericSecure(req, res, next) {
    debug('genericSecure')
    const {
        headers
    } = req
    const hasTokenAndKey = headers['x-access-token'] && headers['x-key']
    if (!hasTokenAndKey) {
        return res.status(400).json({
            success: false,
            message: 'missing x-access-token/x-key in headers'
        })

    } else {
        let decoded = null
        try {
            decoded = jwt.decode(headers['x-access-token'], config.SECRET)
            debug('decoded.expire, now', decoded.expire, moment().unix())
            const notExpired = decoded.expire > moment().unix()
            if (!notExpired) {
                return res.status(401).json({
                    status: false,
                    message: 'token expired'
                })
            }
            if (decoded.username !== headers['x-key']) {
                return res.status(401).json({
                    status: false,
                    message: 'invalid x-key'
                })
            }
        } catch (err) {
             debug('genericSecure', err)
             return res.status(401).json({
                success: false,
                message: 'invalid/expired token'
            })

        }
        const user = getUser(decoded.username)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'user not found !'
            })
        }
        delete user.hashPassword
        req.app.set('current_user', user)
        return next()
    }
}

module.exports = genericSecure