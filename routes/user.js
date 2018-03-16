const express = require('express'),
    debug = require('debug')('simpleapp:routes:auth')
const router = express.Router()
const {
    createUser,
    getUser
} = require('../models/user')
const validator = require('joi')

// router.post("/login", async (req, res, next) => {
//     debug('POST /login')
//     try {
//         const schema = validator.object().keys({
//             username: validator.string().email().required(),
//             password: validator.string().min(5).max(50).required()
//         })
//         const body = req.body

//     } catch (error) {
        
//     }
// })

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
        }else{
            const { username, password} = body
             createUser(username, password)
             res.json({
                 status: 'success',
                 message: `Success create account for user : ${username} `
             })
        }
    
    } catch (error) {
        debug(error.toString())
        res.status(500).json({
            status: 'false',
            message: 'Server Error'
        })
    }

})
module.exports = router