import mongoose from 'mongoose';

const SectorSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true,
    default: 'activity' // Lucide icon code
  },
  features: {
    type: [String],
    default: []
  },
  featuresHeading: {
    type: String,
    default: 'Tailored ERPNext Modules'
  },
  featuresSubheading: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model('Sector', SectorSchema);
