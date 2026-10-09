import React from 'react'
import { assets, features } from '../assets/assets'

const BottomBanner = () => {
  return (
    <div className='relative mt-24 rounded-2xl overflow-hidden shadow-lg'>
      <img src={assets.bottom_banner_image} alt="banner" className='w-full hidden md:block'/>
      <img src={assets.bottom_banner_image_sm} alt="banner" className='w-full md:hidden'/>

      <div className='absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-16 md:pt-0 md:pr-24 bg-gradient-to-t from-green-700/70 via-transparent to-transparent'>
        <div>
            <h1 className='text-3xl md:text-4xl font-extrabold text-yellow-400 mb-6 drop-shadow'>Why We Are The Best?</h1>
            {features.map((feature, index)=>(
                <div key={index} className='flex items-center gap-4 mt-2'>
                    <img src={feature.icon} alt={feature.title} className='md:w-11 w-9'/>
                    <div>
                    <h3 className='text-lg md:text-xl font-semibold text-white'>{feature.title}</h3>
                    <p className='text-gray-100/80 text-xs md:text-sm'>{feature.description}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default BottomBanner
