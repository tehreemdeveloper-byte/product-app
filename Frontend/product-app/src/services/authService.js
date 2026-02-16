import api from "./apiService"

const login = async(credentials) =>{
    try {
        
        const response = await api.post('/auth/login',credentials);
        
        return response.data

    }catch(err) {
        throw new Error(err)
    }

};
    
const register = async (userData) => {
    try {
        
    const response = await api.post("/auth/register", userData);
    return response.data;

    }catch(err) {
        throw new Error(err)
    }
        
};



const authService = {
    register,
    login
}

export default authService