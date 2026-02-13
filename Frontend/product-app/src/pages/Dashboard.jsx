// import axios from 'axios';

import { useEffect, useState } from "react";

import ProductCard from "../components/ProductCard";
import dashboardService from "../services/dashboardService"

const Dashboard = () => {

  const [data,setData] = useState([]);
  const [error,setError] = useState(null);

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
//  const products = [
//   {
//     id: 1,
//     image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
//     category: "Electronics",
//     title: "Wireless Headphones",
//     description:
//       "Premium noise-cancelling over-ear headphones with 30hr battery life",
//     price: "299.99",
//     tags: ["Bluetooth", "Noise Cancelling", "Over-Ear"],
//   },
//   {
//     id: 2,
//     image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
//     category: "Accessories",
//     title: "Leather Backpack",
//     description:
//       "Handcrafted genuine leather backpack with laptop compartment",
//     price: "189.00",
//     tags: ["Leather", "Laptop", "Travel"],
//   },
//   {
//     id: 3,
//     image: "https://images.unsplash.com/photo-1519741497674-611481863552",
//     category: "Electronics",
//     title: "Smart Watch",
//     description:
//       "Fitness tracker with heart rate monitor and GPS",
//     price: "249.99",
//     tags: ["Fitness", "GPS", "Heart Rate"],
//   },
//   {
//     id: 4,
//     image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
//     category: "Footwear",
//     title: "Running Shoes",
//     description:
//       "Lightweight performance running shoes with cushioned sole",
//     price: "129.99",
//     tags: ["Running", "Lightweight", "Sport"],
//   },
// ];


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
            
            />
          ))}
        </div>


      </div>
    </>
  );
};

export default Dashboard;
