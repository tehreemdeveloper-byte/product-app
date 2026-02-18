import React from 'react'

import { useState,useEffect } from 'react'

import Navbar from '../components/Navbar'
import Header from '../components/Header'

import dashboardService from '../services/dashboardService'

import { Outlet } from 'react-router-dom'

const DashboardLayout = () => {

   const [data,setData] = useState([]);
  
  const fetchCart = async () => {
    try {
      const res = await dashboardService.getCartProduct();
      if (res.status === 200) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCart(); 
  }, []);


  return (
<>
<Navbar 
data = {data}
fetchCart={fetchCart} 

/>
 <div className="container py-5">
<Header />


<Outlet context={{fetchCart}} />
 </div>

</>

  )
}

export default DashboardLayout