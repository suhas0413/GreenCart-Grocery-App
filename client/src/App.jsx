import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';
import Login from './components/Login';
import { useAppContext } from './context/AppContest';
import Cart from './pages/Cart';
import SearchResults from './pages/SearchResults';
import AllProducts from './pages/AllProducts';
import Contact from './pages/Contact';
import './App.css';

const App = () => {

  const isSellerPath = useLocation().pathname.includes("seller");
  const { showUserLogin, setshowUserLogin, setUser } = useAppContext();

  return (
    <div>

      {isSellerPath ? null : <Navbar/> }
      <Toaster />
      {showUserLogin && <Login onClose={() => setshowUserLogin(false)} onAuthSuccess={setUser} />}

      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/cart' element={<Cart/>}/>
      <Route path='/search' element={<SearchResults/>}/>
      <Route path='/products' element={<AllProducts/>}/>
      <Route path='/contact' element={<Contact/>}/>
    </Routes>
      </div>
      {!isSellerPath && <Footer/>}
    </div>
  )
}

export default App
