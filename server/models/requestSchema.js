import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  userEmail: String,
  itemName: String,
  itemNumber: String,
  date: Date,
});

export default  mongoose.model('Request', requestSchema);
