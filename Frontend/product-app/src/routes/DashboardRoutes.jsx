// routes/DashboardRoutes.jsx

import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard";

const DashboardRoutes = {
  path: "/dashboard",
  element: <DashboardLayout />,
  children: [
    { index: true, element: <Dashboard /> },
  ],
};

export default DashboardRoutes;
