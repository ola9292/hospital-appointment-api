import mongoose from "mongoose";

const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
   type: String,
    enum: ['booked', 'cancelled', 'completed'],
    default: 'booked',
    required: true
  },
 time:{
    type: String,
    default: Date.now,
    required: true
 },
 date:{
    type: String,
    required: true
 },
},
{ timestamps: true }
);

export default mongoose.model('Appointment', AppointmentSchema);