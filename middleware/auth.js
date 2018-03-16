const debug = require('debug')('simpleapp:middleware:secure')
const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../config')

async function genericSecure(ctx, next) {
    debug('genericSecure')


    return next() // eslint-disable-line
}

module.exports = genericSecure
