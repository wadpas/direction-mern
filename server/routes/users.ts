import express from 'express'
import { getUsers, getUser, getCurrentUser, updateUser, updateUserPassword } from '../controllers/users.js'
import { authorization } from '../middleware/auth.js'

const router = express.Router()

router.route('/').get(authorization('admin'), getUsers)
router.route('/me').get(getCurrentUser)
router.route('/update-user').patch(updateUser)
router.route('/update-password').patch(updateUserPassword)
router.route('/:id').get(getUser)

export default router
