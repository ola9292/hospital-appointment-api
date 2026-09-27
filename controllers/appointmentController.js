import User from '../db/models/User.js'
import Appointment from '../db/models/Appointment.js'
import appointmentService from '../services/appointmentService.js'

export async function getAppointments(req, res){
    //
    const { doctorId, date } = req.query
    try{
        if(!doctorId){
            return res.status(400).json({message: "doctor required"})
        }
        const slots = await appointmentService(doctorId, date)
        if(slots && slots.length > 0){
            return res.status(200).json({slots: slots})
        }
        return res.status(400).json({message: "no slots available"})
    }catch(err){
       return res.status(500).json({ message: "Internal server error" })
    }
}

export async function bookAppointment(req, res){

    try{
        const user_id = req.user.userId
        const { doctorId, time, date } = req.body
        const targetDate = new Date(date);
        const dayOfTheWeek = targetDate.getDay()

        if(dayOfTheWeek == 0 || dayOfTheWeek == 6){
           return res.status(400).json({message: "no booking on weekends"})
        }

        const existingBooking = await Appointment.findOne({
            doctor: doctorId,
            time: time,
            data: date
        })

        if(existingBooking){
            return res.status(400).json({message: "booking exists already"})
        }
    
        const bookedAppointment = await Appointment.create({
            patient: user_id,
            doctor: doctorId,
            status: 'booked',
            time: time,
            date: date
        })
        if(bookAppointment){
            //send email
        }
        return res.status(201).json({message: "booking created successfully"})
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    } 
}   

export async function cancelAppointment(req, res){
    try{
        const id = req.params.id
        const appointment = await Appointment.findById(id)
        if(!appointment){
            return res.status(404).json({message: "appointment not found"})
        }
        await Appointment.findByIdAndDelete(id)
        return res.status(200).json({message: "appointment cancelled successfully"})
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}