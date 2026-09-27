import express from "express"
import { getPatients, getDoctors } from '../controllers/peopleController.js'
import authCheck from "../middleware/authCheck.js"
import { adminCheck } from "../middleware/adminCheck.js"
const router = express.Router()


router.get('/patients', getPatients)
router.get('/doctors', getDoctors)

export default router