import React from 'react'
import { categories } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Categories = () => {
  const navigate = useNavigate()

  return (
    <div className='mt-16'>
      <p className='text-3xl md:text-4xl font-extrabold text-green-700 mb-6'>Categories</p>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-6'>
        {categories.map((category, index) => (
          <div
            key={index}
            className='group cursor-pointer py-7 px-4 gap-2 rounded-2xl flex flex-col justify-center items-center shadow hover:shadow-lg transition-all border border-gray-100 hover:scale-105'
            style={{ backgroundColor: category.bgColor }}
            onClick={() => {
              navigate(`/products?category=${encodeURIComponent(category.path)}`)
              scrollTo(0, 0)
            }}
          >
            <img
              src={category.image}
              alt={category.text}
              className='group-hover:scale-110 transition-transform duration-200 max-w-28 drop-shadow-md'
            />
            <p className='text-base font-bold text-gray-800 mt-2'>{category.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Categories
