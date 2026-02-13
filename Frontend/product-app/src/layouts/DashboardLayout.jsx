import React from 'react'

import Navbar from '../components/Navbar'
import Header from '../components/Header'

import { Outlet } from 'react-router-dom'

const DashboardLayout = () => {
  return (
<>
<Navbar />
 <div className="container py-5">

<Header />
<Outlet/>
 </div>

</>

  )
}

export default DashboardLayout