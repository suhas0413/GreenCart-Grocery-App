import React from 'react'
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
import BestSeller from '../components/BestSeller'
import BottomBanner from '../components/BottomBanner'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className='mt-10'> 
      <MainBanner/>
      <Categories/>
      <BestSeller/>
      <BottomBanner/>
      <Footer/>
    </div>
  )
}

export default Home
