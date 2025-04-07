import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    navigate('/');
  };

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/items');
      setItems(res.data.items);
    } catch (err) {
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleGet = async (id) => {
    try {
      const email = localStorage.getItem('email');
      const res = await axios.patch(`http://localhost:3000/api/items/decrease/${id}`, { email });
      const updatedItem = res.data.item;

      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === updatedItem._id ? { ...item, quantity: updatedItem.quantity } : item
        )
      );
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to decrease item quantity');
    }
  };

  const handleRequest = async (item) => {
    try {
      const userEmail = localStorage.getItem('email');

      const response = await axios.post('http://localhost:3000/api/items/request', {
        userEmail,
        itemName: item.name,
        itemNumber: item.number,
      });

      alert('Request sent successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send request');
    }
  };

  return (
    <div className="min-h-screen w-screen p-5 bg-gray-100 text-gray-800">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md z-10">
        <h1 className="text-lg font-bold">Lab Inventory</h1>
        <button
          onClick={handleLogout}
          className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded shadow p-4 flex flex-col justify-between min-h-[200px]"
              >
                <div>
                  <h3 className="text-lg font-bold mb-1">{item.name}</h3>
                  <p><strong>Item Number:</strong> {item.number}</p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                </div>
                <div className="mt-4">
                  {item.quantity === 0 ? (
                    <button
                      onClick={() => handleRequest(item)}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded"
                    >
                      Request
                    </button>
                  ) : (
                    <button
                      onClick={() => handleGet(item._id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
                    >
                      Get
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
