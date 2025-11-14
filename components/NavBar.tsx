"use client"
import { assets } from '@/assets/assets'
import Image from 'next/image'
import NavLinks from './NavLinks'
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { useTheme } from './theme-provider'
import { Search, User } from 'lucide-react'


function NavBar() {
  const {isDark} = useTheme();


  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      {isDark 
      ? (
        <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => { }}
        src={assets.logo_white}
        alt='logo' />
      )
      : (
        <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => { }}
        src={assets.logo}
        alt='logo' />
      )
      }
      <div className="relative">
        <NavLinks />
      </div>
      <ul className="hidden md:flex items-center gap-4 ">
        <AnimatedThemeToggler />
        <Search color={"var(--color-foreground)"} size={18} />
        <button className="flex cursor-pointer items-center gap-2 text-foreground transition">
          <User color={"var(--color-foreground)"} size={18} />
          Account
        </button>
      </ul>

    </nav>
  )
}

export default NavBar