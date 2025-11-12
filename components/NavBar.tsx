"use client"
import { assets } from '@/assets/assets'
import Image from 'next/image'
import NavLinks from './NavLinks'


function NavBar() {
  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => { }}
        src={assets.logo}
        alt='logo' />

      <div className="relative">
        <NavLinks />
      </div>

      <ul className="hidden md:flex items-center gap-4 ">
        <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
        <button className="flex items-center gap-2 hover:text-gray-900 transition">
          <Image src={assets.user_icon} alt="user icon" />
          Account
        </button>
      </ul>

    </nav>
  )
}

export default NavBar