import express from "express"
import { getCurrentUser } from '../controllers/meController.js'
import authCheck from "../middleware/authCheck.js"
const router = express.Router()

router.get('/me', authCheck, getCurrentUser)

export default router