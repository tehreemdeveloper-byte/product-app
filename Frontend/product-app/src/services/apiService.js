import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";



const apiClient = axios.create({
  baseURL: API_BASE_URL
});


// making request interceptors

apiClient.interceptors.request.use(
  (config)=>{
    
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config

  },
  (error) =>{
    return Promise.reject(error)
  }
)


// making response interceptor
apiClient.interceptors.response.use(
  (response) => {
    //will save the token at the login time for the refreshment 
    return response
  }, (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("authToken") //in case if the token is expire
      localStorage.removeItem("user") //in case if the token is expire
      //  window.location.href = "/login"; // will replace it with the logout function in future
      // Handle unauthorized errors globally (e.g., redirect to login)
    }
    return Promise.reject(error);
  }
)

export default apiClient;



// flow i am working with

// ✅ Login file me token save karo
// ✅ Request interceptor me token attach karo
// ✅ Response interceptor me 401 handle karo
// ✅ Logout pe token remove karo


// export const fetchUserData = async (userId) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching user data:', error);
//     throw error; 
//   }
// };