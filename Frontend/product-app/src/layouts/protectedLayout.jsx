import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ProtectedLayout = ({children}) => {

  const isAuthenticated = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(()=> {
    if(!isAuthenticated){
      
      navigate('/')
    } 
  },[isAuthenticated, navigate])

  return isAuthenticated? children: null
  
}

export default ProtectedLayout

// we can not give access to the user without authentication
// without login we not allowed the user to enter in the forms