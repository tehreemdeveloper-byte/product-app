import { createBrowserRouter } from "react-router-dom";

import AuthRoutes from "./AuthRoutes";
import DashboardRoutes from "./DashboardRoutes";

const router = createBrowserRouter ([
    AuthRoutes,
    DashboardRoutes,
]);

export default router;