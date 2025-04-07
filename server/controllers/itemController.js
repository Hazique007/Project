// controllers/itemController.js
import Item from '../models/itemSchema.js';
import Order from '../models/orderSchema.js';
import jwt from 'jsonwebtoken';
import Request from '../models/requestSchema.js';

// GET all items
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ name: 1 }); // Add sort if needed
    res.status(200).json({ items }); // Send as named object
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE item quantity (decrease by 1)
export const decreaseQuantity = async (req, res) => {
  try {
    const { email } = req.body;
    const itemId = req.params.id;

    const item = await Item.findById(itemId);
    if (!item || item.quantity <= 0) {
      return res.status(400).json({ message: 'Item not found or out of stock' });
    }

    item.quantity -= 1;
    await item.save();

    const order = new Order({
      email,
      itemId,
    });
    await order.save();

    res.status(200).json({
      message: 'Item quantity updated and order created',
      item,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const getOrders = async (req, res) => {
//   try {
//     const orders = await Order.find().populate('itemId');

//     const formattedOrders = orders.map((order) => ({
//       userEmail: order.email,
//       itemName: order.itemId.name,
//       itemNumber: order.itemId.number,
//       date: order.createdAt,
//     }));

//     res.status(200).json(formattedOrders);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const createItem = async (req, res) => {
  const { name, number, quantity } = req.body;

  try {
    const itemExists = await Item.findOne({ number });
    if (itemExists) {
      return res.status(400).json({ message: 'Item number already exists' });
    }

    const item = new Item({ name, number, quantity });
    await item.save();
    res.status(201).json({ message: 'Item created successfully', item });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const placeOrder = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.email;

    const { id } = req.params;
    const item = await Item.findById(id);
    if (!item || item.quantity <= 0) {
      return res.status(400).json({ message: 'Item not found or out of stock' });
    }

    item.quantity -= 1;
    await item.save();

    const order = new Order({
      userEmail,
      itemName: item.name,
      itemNumber: item.number,
    });
    await order.save();

    res.status(200).json({ message: 'Order placed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('itemId');

    const formattedOrders = orders.map((order) => ({
      userEmail: order.email,
      itemName: order.itemId?.name || 'N/A',
      itemNumber: order.itemId?.number || 'N/A',
      date: order.timestamp,
    }));

    res.status(200).json(formattedOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const submitRequest = async (req, res) => {
  const { userEmail, itemName, itemNumber } = req.body;

  try {
    const newRequest = new Request({
      userEmail,
      itemName,
      itemNumber,
      date: new Date(),
    });

    await newRequest.save();
    res.status(200).json({ message: 'Request submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save request' });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find().sort({ date: -1 }); // Newest first
    res.status(200).json(requests);
  } catch (err) {
    console.error('Error fetching requests:', err);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
};


export const updateItemQuantity = async (req, res) => {
  const itemId = req.params.id;
  const { quantityChange } = req.body;

  try {
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Prevent negative quantities
    const newQuantity = item.quantity + quantityChange;
    if (newQuantity < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative' });
    }

    item.quantity = newQuantity;
    await item.save();

    res.status(200).json({ message: 'Quantity updated', item });
  } catch (err) {
    console.error('Error updating item quantity:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    await Item.findByIdAndDelete(id);
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete item', error: err.message });
  }
};



