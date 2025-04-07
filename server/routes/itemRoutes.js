// routes/itemRoutes.js
import express from 'express';
import { getAllItems, decreaseQuantity, createItem, placeOrder, getOrders, submitRequest,deleteItem ,getAllRequests,  updateItemQuantity} from '../controllers/itemController.js';

const router = express.Router();

router.get('/', getAllItems);
router.post('/order/:id', placeOrder); 
router.get('/orders', getOrders);   
router.patch('/decrease/:id', decreaseQuantity);
router.post('/create', createItem);
router.post('/request', submitRequest); // Assuming you want to use the same endpoint for requests
router.get('/requests',  getAllRequests);
router.patch('/:id/quantity',updateItemQuantity);
router.delete('/:itemId',deleteItem);
export default router;
