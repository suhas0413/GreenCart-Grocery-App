import React from 'react';
import ProductCard from './ProductCard';
import { useAppContext } from '../context/AppContest';

const BestSeller = () => {
  const { Products } = useAppContext();

  return (
    <div className='mt-20'>
      <p className='text-3xl md:text-4xl font-extrabold text-green-700 mb-6'>Best Sellers</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8 xl:gap-10 lg:grid-cols-5">
        {Products.filter((product) => product.inStock).slice(0,5).map((product, index)=>(
          <ProductCard key={index} product={product}/>
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
