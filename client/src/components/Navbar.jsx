import React from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { useAppContext } from '../context/AppContest'
import ProductSearch from './ProductSearch'

const LOCATIONS = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata"];

const Navbar = () => {
    const [open, setOpen] = React.useState(false)
    const [location, setLocation] = React.useState(LOCATIONS[0]);
    const {user, setUser, setshowUserLogin, navigate, cartItems} = useAppContext();

    const logout = async ()=>{
      sessionStorage.removeItem('greencart_token');
        setUser(null);
        navigate('/')
    }

    // Calculate cart count
    const cartCount = Object.values(cartItems || {}).reduce((a, b) => a + b, 0);

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 bg-green-600 shadow-lg relative transition-all z-50">

    <NavLink to='/' onClick={()=> setOpen(false)}>
        <img className="h-10" src={assets.logo } alt="logo" />
    </NavLink> 

    {/* Desktop Menu */}
    <div className="hidden lg:flex items-center gap-8">
        {/* Location Selector */}
        <div className="relative">
          <select value={location} onChange={e => setLocation(e.target.value)} className="bg-white text-green-700 font-semibold rounded-full px-4 py-1 shadow border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400">
            {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </div>
        <NavLink to='/' className="text-white font-semibold hover:text-yellow-300 transition">Home</NavLink>
        <NavLink to='/products' className="text-white font-semibold hover:text-yellow-300 transition">All Products</NavLink>
        <NavLink to='/contact' className="text-white font-semibold hover:text-yellow-300 transition">Contacts</NavLink>
      
        <ProductSearch />

        {/* Notification Icon */}
        <button className="ml-4 relative group" aria-label="Notifications">
          <svg className="w-6 h-6 text-white opacity-80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-green-600"></span>
        </button>

        <div onClick={()=> navigate("/cart")} className="relative cursor-pointer ml-4">
            <div className="bg-white rounded-full p-2 shadow hover:scale-105 transition-transform">
              <img src={assets.nav_cart_icon} alt='cart' className='w-6 opacity-80'/>
            </div>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 text-xs text-white bg-yellow-400 w-[20px] h-[20px] rounded-full border-2 border-white font-bold flex items-center justify-center">{cartCount}</span>
            )}
        </div>

        {!user ? (  <button onClick={()=> setshowUserLogin(true)} className="cursor-pointer px-8 py-2 bg-yellow-400 hover:bg-yellow-500 transition text-green-900 font-bold rounded-full ml-4 shadow">
            Login
        </button>)
        :
        (
           <div className='relative group ml-4'>
            <div className="bg-white rounded-full p-1.5 shadow flex items-center justify-center">
              <img src={assets.profile_icon} className='w-10'  alt=''/>
            </div>
            <ul className='hidden group-hover:block absolute top-12 right-0 bg-white shadow border border-gray-200 py-2.5 w-36 rounded-md text-sm z-40'>
                <li onClick={()=> navigate("my-orders")} className='p-2 pl-4 hover:bg-green-100 cursor-pointer'>My Orders</li>
                <li onClick={logout} className='p-2 pl-4 hover:bg-green-100 cursor-pointer'>Logout</li>
            </ul>
           </div> 
        )}
    </div>

    <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="lg:hidden">
        <img src={assets.menu_icon} alt='menu' className="w-8 h-8"/>
    </button>

    {/* Mobile Menu */}
    { open && (
        <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-green-600 shadow-lg py-4 flex-col items-start gap-2 px-5 text-sm lg:hidden z-50`}> 
        {/* Location Selector */}
        <div className="w-full mb-2">
          <select value={location} onChange={e => setLocation(e.target.value)} className="bg-white text-green-700 font-semibold rounded-full px-4 py-1 shadow border border-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-green-400">
            {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </div>
        <ProductSearch variant="mobile" />
        <NavLink to="/" onClick={()=> setOpen(false)} className="text-white font-semibold py-2">Home</NavLink>
        <NavLink to="/products" onClick={()=> setOpen(false)} className="text-white font-semibold py-2">All Products</NavLink>
        {user &&
        <NavLink to="/products" onClick={()=> setOpen(false)} className="text-white font-semibold py-2">My Orders</NavLink>
        }
        <NavLink to="/contact" onClick={()=> setOpen(false)} className="text-white font-semibold py-2">Contact</NavLink>

        {!user ? (
        <button onClick={()=>{
           setOpen(false);
           setshowUserLogin(true);
        }} className="cursor-pointer px-6 py-2 mt-2 bg-yellow-400 hover:bg-yellow-500 transition text-green-900 font-bold rounded-full text-sm w-full">Login</button>
    ) : (
        <button onClick={logout} className="cursor-pointer px-6 py-2 mt-2 bg-yellow-400 hover:bg-yellow-500 transition text-green-900 font-bold rounded-full text-sm w-full">Logout</button> 
    )}

    </div>
    )}

</nav>
  )
}

export default Navbar





