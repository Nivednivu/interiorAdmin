import { useState } from 'react'
import './App.css'
import AdminDashboard from './pages/Admin/AdminDashboard'
import { Route, Routes } from 'react-router-dom'
import AdminLogin from './pages/Admin/AdminLogin'
import AdminHeader from './components/AdminHeader/AdminHeader'
import AdminFooter from './components/AdminFooter/AdminFooter'

function App() {

  return (
    <>
    <AdminHeader/>
    <Routes>
      <Route path='/' element={    <AdminLogin/>}/>
      <Route path='/admin' element={    <AdminDashboard/>
}/>

    </Routes>
  <AdminFooter/>
    </>
  )
}

export default App
