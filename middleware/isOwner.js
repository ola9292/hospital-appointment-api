import Appointment from "../db/models/Appointment.js";

export default async function(req, res, next){

    const id = req.params.id;
    const current_user_id = req.user.userId
    try{
        const appointment = await Appointment.findById(id)

        if(!appointment){
            return res.status(404).json({message: "appointment not found"})
        }
        // console.log(req.user.role)
        if(appointment.patient.toString() === current_user_id || req.user.role == "doctor"){
            return next()
        }
        return res.status(403).json({message: "you are not authorized"})
    }catch(err){
        console.log(err)
    }

}