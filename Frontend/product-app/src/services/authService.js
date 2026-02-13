import api from "./apiService"

const login = async(credentials) =>{
    try {
        
        const response = await api.post('/auth/login',credentials);
        console.log("i M response",response);
        
        return response.data.data

    }catch(err) {
        throw new Error(err)
    }

};
    
const register = async (userData) => {
    try {
        
    const response = await api.post("/auth/register", userData);
    return response.data.data;

    }catch(err) {
        throw new Error(err)
    }
        
};

const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user"); 
};

const authService = {
    register,
    login,
    logout
}

export default authService