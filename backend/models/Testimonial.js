import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  clientPosition: {
    type: String,
    required: true,
    trim: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  feedback: {
    type: String,
    required: true
  },
  avatarPath: {
    type: String,
    default: ''
  },
  sector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sector',
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model('Testimonial', TestimonialSchema);
