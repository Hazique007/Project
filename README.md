
# 🧪 Lab Inventory Management System

A full-stack MERN (MongoDB, Express, React, Node.js) based inventory management system designed for laboratory environments. Supports role-based access for Admins and Users, real-time request notifications, and inventory control.

---

## 🚀 Features

### 👤 Role-Based Access
- **Admin** can:
  - Add, edit, and delete items.
  - View all user requests.
  - Receive notifications when users request stock/out-of-stock items.
- **Users** can:
  - View available items.
  - Request items (including out-of-stock).
  - Track status of their requests.

### 🔔 Request Notification System
- Admin receives real-time notifications of item requests.
- Requests are shown in a table with:
  - Requester email
  - Item name & number
  - Request date

### 🧩 Modern UI
- Item cards with delete/edit controls (admin only).
- Responsive layout for both admin and user dashboards.
- Clean and functional tables for request logs.

### 🗂️ Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **State Management:** React hooks / Context API
- **Authentication:** JWT 

---

## 🛠️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/lab-inventory-system.git
cd lab-inventory-system
```

### 2. Setup Backend
```bash
cd backend
npm install
touch .env
# Add your MongoDB URI and other secrets to .env
npm run dev
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm start
```


