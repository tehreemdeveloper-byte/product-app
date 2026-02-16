import { useContext } from 'react'
import React from 'react'

import { Navigate } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'

const ProtectedRoutes = ({children}) => {
  
    const {token} = useContext(AuthContext);
    if(!token) {
        return <Navigate to="/" replace />
    }
  
    return children
}

export default ProtectedRoutes