import User from '../db/models/User.js'
import Appointment from '../db/models/Appointment.js'

export default async function appointmentService(doctorId, requestedDateStr) {
    // 1. Resolve target date and today's date
    const now = new Date();
    const targetDate = requestedDateStr ? new Date(requestedDateStr) : new Date();
    
    const dayOfTheWeek = targetDate.getDay();
    const allSlots = appointmentTimes();

    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // Format today's YYYY-MM-DD to compare against formattedDate
    const todayYear = now.getFullYear();
    const todayMonth = String(now.getMonth() + 1).padStart(2, '0');
    const todayDay = String(now.getDate()).padStart(2, '0');
    const todayFormatted = `${todayYear}-${todayMonth}-${todayDay}`;

    // Weekend guard
    if (dayOfTheWeek === 0 || dayOfTheWeek === 6) {
        return [];
    }

    // Past date guard: if requested date is strictly before today, return empty
    if (formattedDate < todayFormatted) {
        return [];
    }

    // Fetch existing bookings from DB
    const bookedAppointments = await Appointment.find({
        'doctor': doctorId,
        'status': 'booked',
        'date': formattedDate
    });

    const takenTimes = bookedAppointments.map((app) => app.time);

    // Filter 1: Remove already booked slots
    let availableSlots = allSlots.filter((slot) => !takenTimes.includes(slot));

    // 💡 NEW: Real-Time Guard (If checking for TODAY, remove past slots)
    if (formattedDate === todayFormatted) {
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        availableSlots = availableSlots.filter((slot) => {
            const slot24Hour = parseSlotTo24Hour(slot); // Convert "09:30 AM" -> { hour: 9, minute: 30 }
            
            if (slot24Hour.hour > currentHour) {
                return true;
            }
            if (slot24Hour.hour === currentHour && slot24Hour.minute > currentMinute) {
                return true;
            }
            return false;
        });
    }

    return availableSlots;
}

// Helper function to parse "09:30 AM" or "02:00 PM" into 24h numerical values
function parseSlotTo24Hour(slotStr) {
    const [time, ampm] = slotStr.split(' ');
    let [hour, minute] = time.split(':').map(Number);

    if (ampm === 'PM' && hour !== 12) {
        hour += 12;
    } else if (ampm === 'AM' && hour === 12) {
        hour = 0;
    }

    return { hour, minute };
}

function appointmentTimes() {
    const appointmentArr = [];
    const startTime = 9;  // 9 AM
    const endTime = 17;   // 5 PM (in 24-hour time)

    for (let hour = startTime; hour < endTime; hour++) {
        const displayHour = hour > 12 ? hour - 12 : hour;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hourStr = displayHour.toString().padStart(2, '0');

        appointmentArr.push(`${hourStr}:00 ${ampm}`);
        appointmentArr.push(`${hourStr}:30 ${ampm}`);
    }
    return appointmentArr;
}