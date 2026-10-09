import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const MainBanner = () => {
  return (
    <div className='relative rounded-2xl overflow-hidden shadow-lg'>
      <img src={assets.main_banner_bg} alt="banner" className='w-full hidden md:block' />
      <img src={assets.main_banner_bg_sm} alt="banner" className='w-full md:hidden' />

      <div className='absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center pb-24 md:pb-0 px-4 md:pl-24 bg-gradient-to-t from-green-700/70 via-transparent to-transparent'>
        <h1 className='text-4xl md:text-5xl lg:text-6xl font-extrabold text-white md:text-left max-w-2xl leading-tight drop-shadow-lg'>
          Freshness You Can Trust, Savings You Will Love!
        </h1>

        <div className='flex items-center mt-8 font-semibold gap-4'>
          <Link to="/products" className='group flex items-center gap-2 px-8 py-4 bg-yellow-400 hover:bg-yellow-500 transition rounded-full text-green-900 text-lg shadow-lg cursor-pointer'>
            Shop now
            <img className='md:hidden transition group-hover:translate-x-1' src={assets.white_arrow_icon} alt='arrow' />
          </Link>

          <Link to="/products" className='group hidden md:flex items-center gap-2 px-10 py-4 bg-white hover:bg-gray-100 transition rounded-full text-green-700 text-lg shadow-lg cursor-pointer'>
            Explore deals
            <img className='transition group-hover:translate-x-1' src={assets.black_arrow_icon} alt='arrow' />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MainBanner
