// routes/DashboardRoutes.jsx

import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import ProtectedRoutes from "./ProtectedRoutes";

const DashboardRoutes = {
  path: "/dashboard",
  element: (
    <ProtectedRoutes>

      <DashboardLayout />
    </ProtectedRoutes>
  ),
  
  children: [
    { 
      index: true, 
      element: <Dashboard /> 

    },
  ],
};

export default DashboardRoutes;
//jaha jaha ma chahti hu wo login huwy bgair na jayee to usko hm protected route m wrap ker daity h
// Layout ko protect karo Taake us layout ke andar jitne bhi children routes hain — sab automatically protected ho jayein.