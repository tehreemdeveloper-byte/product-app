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

const addToCart = async(productId) => {
    try {
        const response = await api.post('/product/add',{
      product_id: productId   // ✅ object me bhejo
    });
        return response
    }catch(error){
        throw new Error(error);
        
    }
}

const getCartProduct = async() => {
    try {
        const response = await api.get('/product/cart');
        return response
    }catch(error){
        throw new Error(error);
        
    }
}

const decrementCartProduct = async(productId) => {
    try {
        const response = await api.patch('/product/decrement',
            
            {
                product_id: productId
            }
        );
        return response.data.data
    }catch(error){
        throw new Error(error);
        
    }
}




const dashboardService = {
  getProducts,
  addToCart,
  getCartProduct,
  decrementCartProduct
};

export default dashboardService;
