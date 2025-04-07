import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true },
  
});

const Item = mongoose.model('Item', itemSchema);
export default Item;
