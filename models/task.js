const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const config = require('../config')
const adapter = new FileSync(config.DB_PATH)
const db = low(adapter)
const shortid = require('shortid')

/**
 * delete a task by user 
 * @param {*} taskId 
 * @param {*} userId 
 */
const deleteTask = (taskId, userId) => {
    db.get(config.DB_TASK_PREFIX).remove({
        id: taskId,
        userId
    }).write()
    return
}
/**
 * update user task
 * @param {*} note 
 * @param {*} taskId 
 * @param {*} userId 
 * @param {*} done 
 */
const updateTask = (note, taskId, userId, done) => {
    const conditions = {
        id: taskId,
        userId,
    }
    const updateObj = {
        note,
        done
    }
    if(!note){
        delete updateObj.note
    }
    if(!done){
        delete updateObj.done
    }
    db.get(config.DB_TASK_PREFIX).find(conditions).assign(updateObj).write()
    return
}
/**
 *  get list tasks of user 
 * @param {*} userId 
 */
const getTasks = (userId) => {
    return db.get(config.DB_TASK_PREFIX).filter(task => task.userId === userId).value()
}
/**
 * get one task
 * @param {*} taskId 
 * @param {*} userId
 * @returns {*} task object
 */
const getTask = (taskId, userId) => {
    const task = db.get(config.DB_TASK_PREFIX).
    find(task => (task.id === taskId && task.userId === userId)).
    value()
    return task
}
/**
 * add task for user 
 * @param {*} note 
 * @param {*} userId 
 */
const addTask = (note, userId) => {
    try {
        db.get(config.DB_TASK_PREFIX).push({
            id: shortid.generate(),
            userId,
            done: false,
            note
        }).write()
        return
    } catch (error) {
        throw new Error(`Could not add Task for userId => ${userId}`)
    }

}

module.exports = {
    deleteTask,
    updateTask,
    getTasks,
    addTask,
    getTask
}