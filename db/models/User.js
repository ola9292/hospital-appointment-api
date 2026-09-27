import mongoose from "mongoose";


const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique:true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
        type: String,
        enum: ['patient', 'doctor', 'admin'],
        default: 'patient',
        required: true
      },
  is_admin: { 
    type: Boolean, 
    default: false
  },
});

export default mongoose.model('User', UserSchema);