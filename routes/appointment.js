import express from "express"
import { getAppointments, bookAppointment, cancelAppointment } from '../controllers/appointmentController.js'
import authCheck from "../middleware/authCheck.js"
import { adminCheck } from "../middleware/adminCheck.js"
import isOwner from '../middleware/isOwner.js'
const router = express.Router()


router.get('/appointments', authCheck, getAppointments)
router.post('/appointments', authCheck, bookAppointment)
router.delete('/appointments/:id', authCheck, isOwner, cancelAppointment)

export default router