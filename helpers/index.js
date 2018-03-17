const bcrypt = require('bcryptjs')
const _ = require('lodash')
exports.hashPassword = function hashPassword(plaintext) {
    return bcrypt.hashSync(plaintext, 5)
}

exports.compareHash = function compareHash(plaintext, hash) {
    return bcrypt.compareSync(plaintext, hash)
}
/**
 *  paginate array with conditional
 * @param {*} items 
 * @param {*} page 
 * @param {*} per_page 
 */
exports.getPaginatedItems = function (items = [], page = 1, per_page = 5) {
    per_page = parseInt(per_page)
    page = parseInt(page)
    offset = (page - 1) * per_page,
        take = (offset + per_page),
        paginatedItems = _.uniq(_.slice(items, offset, take))
    return {
        page: page,
        per_page: per_page,
        total: items.length,
        total_pages: Math.ceil(items.length / per_page),
        data: paginatedItems
    };
}