import express from 'express'
import { login, register, logout } from '../controllers/auth.js'

const router = express.Router()

router.route('/login').post(login)
router.route('/register').post(register)
router.route('/logout').get(logout)

export default router
