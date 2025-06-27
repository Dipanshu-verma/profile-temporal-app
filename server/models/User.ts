import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  city: string;
  pincode: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    default: '',
  },
  pincode: {
    type: String,
    default: '',
  }
}, {
  timestamps: true,
});

export default mongoose.model<IUser>('User', userSchema);