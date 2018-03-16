const express = require('express'),
    debug = require('debug')('simpleapp:routes:auth')
const router = express.Router()
const {
    createUser,
    getUser
} = require('../models/user')
const validator = require('joi')
const config = require('../config')
const moment = require('moment')
const jwt = require('jwt-simple')
const {
    hashPassword,
    compareHash
} = require('../helpers')



router.post("/login", async (req, res, next) => {
    debug('POST /login')
    try {
        const schema = validator.object().keys({
            username: validator.string().email().required(),
            password: validator.string().min(5).max(50).required()
        })
        const body = req.body
        const error = validator.validate(body, schema).error,
            verbosity = !error || error.details
        if (error && verbosity) {
            res.status(400).json({
                code: 400,
                message: 'Missing or invalid params',
                verbosity: verbosity
            });
        } else {

            const user = getUser(body.username)
            const {
                username,
                hashPassword,
                id
            } = user
            const validHash = await compareHash(body.password, hashPassword)
            if (!user || !validHash) {
                throw new Error('invalid email/password')
            } else {
                const payload = {
                    id,
                    username,
                    expire: moment().add('3', 'days')
                }
                res.json({
                    success: true,
                    data: {
                        auth_token: jwt.encode(payload, config.SECRET)
                    }
                })
            }

        }

    } catch (error) {
        debug(error.toString())
        res.status(500).json({
            status: false,
            message: `login failed : ${error.message}`
        })
    }
})

router.post("/signup", async (req, res, next) => {
    debug('POST /signup')
    try {
        const schema = validator.object().keys({
            username: validator.string().email().required(),
            password: validator.string().min(5).max(50).required()
        })
        const body = req.body
        const error = validator.validate(body, schema).error,
            verbosity = !error || error.details
        if (error && verbosity) {
            res.status(400).json({
                code: 400,
                message: 'Missing or invalid params',
                verbosity: verbosity
            });
        } else {
            const {
                username,
                password
            } = body
            createUser(username, password)
            res.json({
                status: true,
                message: `Success create account for user : ${username} `
            })
        }

    } catch (error) {
        debug(error.message)
        res.status(500).json({
            status: false,
            message: error.message
        })
    }

})
module.exports = router