const express = require('express'),
    debug = require('debug')('simpleapp:routes:auth')
const router = express.Router()
const validator = require('joi')
const {
    getPaginatedItems
} = require('../helpers')
const {
    getTask,
    getTasks,
    addTask,
    updateTask,
    deleteTask
} = require('../models/task')


router.get('/', (req, res) => {
    try {
        const current_user = req.app.get('current_user')
        const schema = validator.object().keys({
            page: validator.number().min(1).optional(),
            per_page: validator.number().min(1).optional(),
            task_id: validator.string().optional()
        })
        const query = req.query
        const error = validator.validate(query, schema).error,
            verbosity = !error || error.details

        if (error && verbosity) {
            return res.status(400).json({
                code: 400,
                message: 'Missing or invalid params',
                verbosity: verbosity
            });
        } else {
            const {
                page,
                per_page,
                task_id
            } = query
            if (task_id) {
                let task = getTask(task_id, current_user.id)
                return res.json({
                    data: task
                })
            } else {
                let tasks = getTasks(current_user.id)
                tasks = getPaginatedItems(tasks, page, per_page)

                return res.json({
                    data: tasks
                })
            }

        }
    } catch (error) {
        debug(error.message)
        res.status(500).json({
            status: false,
            message: error.message
        })
    }

})
router.put('/', (req, res) =>{
    try {
        const body = req.body
        const current_user = req.app.get('current_user')
        const schema = validator.object().keys({
            task_id: validator.string().required(),
            note: validator.string().optional(),
            done: validator.boolean().optional()
        })
        const error = validator.validate(body, schema).error,
        verbosity = !error || error.details
        if (error && verbosity) {
            res.status(400).json({
                code: 400,
                message: 'Missing or invalid params',
                verbosity: verbosity
            });
        }else{
            // one task can be update done one time . note can be update no limit 
            const {note, done, task_id} = req.body
            updateTask(note, task_id, current_user.id, done)
            res.json({
                status: true,
                message: 'success update task!'
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
router.delete('/', (req, res) => {
    try {
        const query = req.query
        const current_user = req.app.get('current_user')
    
        const schema = validator.object().keys({
            task_id: validator.string().required()
        })
        const error = validator.validate(query, schema).error,
            verbosity = !error || error.details
        if (error && verbosity) {
            res.status(400).json({
                code: 400,
                message: 'Missing or invalid params',
                verbosity: verbosity
            });
        } else {
            // delete only when taskId math with userId 
            deleteTask(query.task_id, current_user.id)
            // why always success? easy!!! denied hacker not user 
            res.json({
                status: true,
                message: 'success delete task!'
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

router.post('/', (req, res) => {
    try {
        const schema = validator.object().keys({
            note: validator.string().required()
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
                note
            } = body
            const current_user = req.app.get('current_user')
            addTask(note, current_user.id)
            res.json({
                success: true,
                message: "success add task !"
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