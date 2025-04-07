import React from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/adminPage'

const App = () => {
  return (
   <BrowserRouter>
   <Routes>
    <Route path='/' element={<LoginPage />} />
    <Route path='/home' element={<HomePage />} />
    <Route path='/admin' element={<AdminPage />} />


  
   </Routes>
   </BrowserRouter>
  )
}

export default App
