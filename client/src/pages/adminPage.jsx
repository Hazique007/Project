import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [formData, setFormData] = useState({ name: '', number: '', quantity: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showOrders, setShowOrders] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [items, setItems] = useState([]);
  const [unreadRequestCount, setUnreadRequestCount] = useState(0);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:3000/api/items/create', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMsg(res.data.message || 'Item created successfully!');
      setErrorMsg('');
      setFormData({ name: '', number: '', quantity: '' });
      fetchItems();
      setShowForm(false);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Submission failed');
      setSuccessMsg('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/items');
      setItems(res.data.items);
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  };

  const fetchRequestCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/api/items/requests/count', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnreadRequestCount(res.data.count || 0);
    } catch (err) {
      console.error('Error fetching request count:', err);
    }
  };

  const updateQuantity = async (itemId, change) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:3000/api/items/${itemId}/quantity`, {
        quantityChange: change,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchItems();
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchItems();
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchRequestCount();
  }, []);

  useEffect(() => {
    if (showOrders) {
      const fetchOrders = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get('http://localhost:3000/api/items/orders', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setOrders(res.data);
        } catch (err) {
          console.error('Error fetching orders:', err);
        }
      };
      fetchOrders();
    }
  }, [showOrders]);

  useEffect(() => {
    if (showRequests) {
      const fetchRequests = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get('http://localhost:3000/api/items/requests', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setRequests(res.data);
          setUnreadRequestCount(0); // Reset the badge count
        } catch (err) {
          console.error('Error fetching requests:', err);
        }
      };
      fetchRequests();
    }
  }, [showRequests]);

  return (
    <div className="min-h-screen w-screen pt-5 bg-gray-100 text-gray-800">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md z-10">
        <h1 className="text-lg font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowRequests(true)} className="relative bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
            Requests
            {unreadRequestCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadRequestCount}
              </span>
            )}
          </button>
          <button onClick={() => setShowOrders(true)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">Orders</button>
          <button onClick={() => setShowForm(!showForm)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
            {showForm ? 'Close Form' : 'Add Item'}
          </button>
          <button onClick={handleLogout} className="hover:bg-gray-800 text-white px-3 py-1 rounded">Logout</button>
        </div>
      </header>

      <main className="pt-24 px-6">
        {/* Form */}
        {showForm && (
          <div className="bg-white p-6 rounded shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Add Inventory Item</h2>
            {errorMsg && <div className="text-red-600 mb-2">{errorMsg}</div>}
            {successMsg && <div className="text-green-600 mb-2">{successMsg}</div>}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" name="name" placeholder="Item Name" className="border p-2 rounded" value={formData.name} onChange={handleChange} required />
              <input type="text" name="number" placeholder="Item Number" className="border p-2 rounded" value={formData.number} onChange={handleChange} required />
              <input type="number" name="quantity" placeholder="Quantity" className="border p-2 rounded" value={formData.quantity} onChange={handleChange} required />
              <button type="submit" className="col-span-1 md:col-span-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mt-2">Submit</button>
            </form>
          </div>
        )}

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded shadow p-4 flex flex-col justify-between min-h-[250px]">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-bold">{item.name}</h3>
                  <button onClick={() => deleteItem(item._itemId)} title="Delete Item" className="text-red-500 bg-white hover:text-red-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 8a1 1 0 011 1v5a1 1 0 11-2 0V9a1 1 0 011-1zm4 0a1 1 0 011 1v5a1 1 0 11-2 0V9a1 1 0 011-1zm4-3a1 1 0 00-1-1H7a1 1 0 00-1 1v1H3.5a.5.5 0 000 1h.549l.416 9.243A2 2 0 006.462 19h7.076a2 2 0 001.997-1.757l.416-9.243h.549a.5.5 0 000-1H15V5zM8 5h4v1H8V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <p><strong>Item Number:</strong> {item.number}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
              </div>
              <div className="mt-4 flex justify-center gap-2">
                <button onClick={() => updateQuantity(item._id, -1)} disabled={item.quantity <= 0} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">-</button>
                <button onClick={() => updateQuantity(item._id, 1)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded">+</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Orders Modal */}
      {showOrders && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl overflow-y-auto max-h-[80vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">User Orders</h2>
              <button onClick={() => setShowOrders(false)} className="text-red-600">Close</button>
            </div>
            {orders.length === 0 ? <p>No orders placed yet.</p> : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2">Email</th>
                    <th className="p-2">Item Name</th>
                    <th className="p-2">Item Number</th>
                    <th className="p-2">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{order.userEmail}</td>
                      <td className="p-2">{order.itemName}</td>
                      <td className="p-2">{order.itemNumber}</td>
                      <td className="p-2">{new Date(order.date).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Requests Modal */}
      {showRequests && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl overflow-y-auto max-h-[80vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">User Requests</h2>
              <button onClick={() => setShowRequests(false)} className="text-red-600">Close</button>
            </div>
            {requests.length === 0 ? <p>No item requests submitted.</p> : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2">Email</th>
                    <th className="p-2">Item Name</th>
                    <th className="p-2">Item Number</th>
                    <th className="p-2">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{req.userEmail}</td>
                      <td className="p-2">{req.itemName}</td>
                      <td className="p-2">{req.itemNumber}</td>
                      <td className="p-2">{new Date(req.date).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
