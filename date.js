const today = new Date()

//day of the month
// console.log(today.getDate())
//day of the week
// console.log(today.getDay())
// //current time
// console.log(today.getHours() + ":" + today.getMinutes())
console.log(today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate())
// function appointmentTimes(){
//     const appointmentArr = [];

//     const startTime = 9;  // 9 AM
//     const endTime = 17;   // 5 PM (in 24-hour time)

//     for (let hour = startTime; hour < endTime; hour++) {
//     // Convert 24h format to 12h format
//     const displayHour = hour > 12 ? hour - 12 : hour;
//     const ampm = hour >= 12 ? 'PM' : 'AM';

//     // Format hour with leading zero if needed (e.g., "09")
//     const hourStr = displayHour.toString().padStart(2, '0');

//     // Push 00 and 30 minute slots
//     appointmentArr.push(`${hourStr}:00 ${ampm}`);
//     appointmentArr.push(`${hourStr}:30 ${ampm}`);
//     }
//     console.log(appointmentArr)
// }

// appointmentTimes()