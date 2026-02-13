
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/LoginPage";
import Signup from "../pages/SignUpPage";

const AuthRoutes = {
  path: "/",
  element: <AuthLayout />,
  children: [
    { index:true, element: <Login /> },
    { path: "signup", element: <Signup /> },
  ],
};

export default AuthRoutes;
