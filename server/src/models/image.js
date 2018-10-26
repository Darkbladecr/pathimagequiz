import mongoose, { Schema } from 'mongoose';

const ImageSchema = new Schema({
  url: String,
  a: {
    type: Number,
    default: 0,
  },
  b1: {
    type: Number,
    default: 0,
  },
  b2: {
    type: Number,
    default: 0,
  },
  b3: {
    type: Number,
    default: 0,
  },
  vessels: {
    type: Number,
    default: 0,
  },
  noVessels: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model('Image', ImageSchema, 'images');
