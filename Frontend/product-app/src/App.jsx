import "react-toastify/dist/ReactToastify.css";
import "./styles/toast.css";

import './App.css'

import {ToastContainer} from 'react-toastify';
import {RouterProvider} from  "react-router-dom";

import router from "./routes/index";


function App() {

 
  return (
    <>

    <RouterProvider  router={router} />
<ToastContainer
   position="top-center"
  autoClose={1500}
  hideProgressBar={false}
  closeOnClick
  pauseOnHover
  theme="light"
/>
    </>
  )
}

export default App
// render only react component