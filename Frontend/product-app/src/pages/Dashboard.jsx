
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import dashboardService from "../services/dashboardService"

const Dashboard = () => {

  const [data,setData] = useState([]);
  const [error,setError] = useState(null);

  const {fetchCart} = useOutletContext();

  useEffect(()=>{
    // axios.get('http://localhost:3000/api/product')
    // .then(response=> {
    //   setData(response.data.data)
    //   console.log("i am data",response.data);
      
    // })
    // .catch(error => {
    //   console.error('Error fetching data:',error);
      
    // });

    const fetchProducts = async() => {
      try {
        const data = await dashboardService.getProducts();
        setData(data)
      }catch(error) {
        setError(error.message);
      }

    }

  fetchProducts();

  },[])


if (error) {
  return <p>Error: {error}</p>;
}

  return (
    <>

      <div className="container py-5">
        

        {/* Product Grid */}
        <div className="row">
          {data.map((item) => (
           
           <ProductCard 
            
             key={item._id}
            image={item.image}
            category="electronics"
            title={item.name}
            description={item.description}
            price={item.price}
            tags={item.tags}
            id = {item._id}
            fetchCart = {fetchCart}
            />
          ))}
        </div>


      </div>
    </>
  );
};

export default Dashboard;
