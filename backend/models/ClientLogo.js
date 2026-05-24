import mongoose from 'mongoose';

const ClientLogoSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  // Base64-encoded image stored directly in the database
  logoData: {
    type: String,
    required: true
  },
  logoMimeType: {
    type: String,
    required: true,
    default: 'image/png'
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
