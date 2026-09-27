import User from '../db/models/User.js'
import Appointment from '../db/models/Appointment.js'

export default async function appointmentService(doctorId, requestedDateStr){
 
    const targetDate = requestedDateStr ? new Date(requestedDateStr) : new Date();
    const dayOfTheWeek = targetDate.getDay()
    const allSlots = appointmentTimes()
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0'); // Fixes 0-index bug
    const day = String(targetDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

      
     console.log(dayOfTheWeek)
    if(dayOfTheWeek == 0 || dayOfTheWeek == 6){
        return []
    }

    const bookedAppointments = await Appointment.find({
        'doctor' : doctorId,
        'status': 'booked',
        'date' : formattedDate
    })
     console.log(bookedAppointments)
    const takenTimes = bookedAppointments.map((app) => app.time)

    

    const availableSlots = allSlots.filter((slot) => !takenTimes.includes(slot))

    return availableSlots

}

function appointmentTimes(){
    const appointmentArr = [];

    const startTime = 9;  // 9 AM
    const endTime = 17;   // 5 PM (in 24-hour time)

    for (let hour = startTime; hour < endTime; hour++) {
    // Convert 24h format to 12h format
    const displayHour = hour > 12 ? hour - 12 : hour;
    const ampm = hour >= 12 ? 'PM' : 'AM';

    // Format hour with leading zero if needed (e.g., "09")
    const hourStr = displayHour.toString().padStart(2, '0');

    // Push 00 and 30 minute slots
    appointmentArr.push(`${hourStr}:00 ${ampm}`);
    appointmentArr.push(`${hourStr}:30 ${ampm}`);
    }
    return appointmentArr
}