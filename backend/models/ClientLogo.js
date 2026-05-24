import mongoose from 'mongoose';

const ClientLogoSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  logoPath: {
    type: String,
    required: true
  },
  websiteUrl: {
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

export default mongoose.model('ClientLogo', ClientLogoSchema);
