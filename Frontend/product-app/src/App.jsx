
import {RouterProvider} from  "react-router-dom";
import router from "./routes/index";

import './App.css'

function App() {
 
  return (
    <>

    <RouterProvider  router={router} />

  
      {/* <div>
     <SignUp/>
     <Login/>
     <Dashboard />
     
     
     </div> */}
    </>
  )
}

export default App
// render only react component