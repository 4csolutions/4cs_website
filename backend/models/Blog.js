import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  summary: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true // Markdown formatted content
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  datePublished: {
    type: Date,
    default: Date.now
  },
  coverImage: {
    type: String,
    default: ''
  },
  sector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sector',
    default: null
  },
  metaKeywords: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

export default mongoose.model('Blog', BlogSchema);
