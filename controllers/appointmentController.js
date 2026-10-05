import User from '../db/models/User.js'
import Appointment from '../db/models/Appointment.js'
import appointmentService from '../services/appointmentService.js'
import userTransformer from '../transformers/userTransformer.js'
import { emailSender } from '../services/emailService.js'

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
        
        const doctor = await User.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const bookedAppointment = await Appointment.create({
            patient: user_id,
            doctor: doctorId,
            status: 'booked',
            time: time,
            date: date
        })
        const message = `You have a doctor's appointment by ${time} on ${date}`
        const doctor_message = `You have been booked by ${req.user.name} at ${time} on ${date}`
        const user_email = req.user.email
        if(bookedAppointment){git
            //send email to client
            emailSender(user_email,'Booking Confirmed', message)
                .catch(err => console.error("Background email failed:", err));
            //send email to doctor
            emailSender(doctor.email,'New Booking', doctor_message)
                .catch(err => console.error("Background email failed:", err));
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

export async function getMyAppointments(req, res){
    try{
        const user = req.user
        if(!user){
            res.status(400).json({message: 'user not found'})
        }
        if(user.role === 'doctor'){
            const appointments = await Appointment.find({
                'doctor': user.userId
            }).populate('patient', 'name email')
            .populate('doctor','name email')
            res.status(200).json({data: appointments})
        }
        if(user.role === 'patient'){
            const appointments = await Appointment.find({
                'patient': user.userId
            }).populate('doctor','name email')
            .populate('patient', 'name email')
            res.status(200).json({data: appointments})
        }
   
    }catch(err){
        console.log(err)
        res.status(500).json({ error: "Internal server error" })
    }
}