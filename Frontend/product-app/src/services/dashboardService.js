import api from "./apiService";


// getting all the products
const getProducts = async()=> {
    try {
        const response = await api.get('/product');
        return response.data.data

    }catch(error) {
        throw new Error(error);
    }

}

const dashboardService = {
  getProducts
};

export default dashboardService;
