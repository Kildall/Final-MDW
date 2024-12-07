'use client'
import Image from 'next/image'
import { useState } from 'react'
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from "@/components/ui/navbar/navigation-menu"
import { Button } from "@/components/ui/button"
import { ListItem } from "./list-item"
import { LogIn, LogOut } from 'lucide-react'
import Link from 'next/link'
interface NavItem {
  title: string
  href: string
  description: string
}

const navItems: NavItem[] = [
  {
    title: 'Ventas',
    href: '/sales',
    description: 'Todas las ventas de la empresa',
  },
  {
    title: 'Productos',
    href: '/products',
    description: 'Disponibilidad de inventario',
  },
  {
    title: 'Entregas',
    href: '/deliveries',
    description: 'Diferentes entregas y sus detalles',
  },
  {
    title: 'Proveedores',
    href: '/suppliers',
    description: 'Proveedores con los que trabajamos',
  },
]

function Navbar() {
  // Mock login state (replace with Redux state later)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLoginClick = () => {
    setIsLoggedIn(!isLoggedIn)
  }

  return (
    <div className="w-full h-20 bg-primary flex items-center justify-between px-4">
      <div className="flex items-center w-full max-w-7xl m-auto">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/svg/logo.svg"
            alt="Company Logo"
            width={192}
            height={192}
            className="cursor-pointer h-12"
          />
        </Link>

        {/* Centered Navigation Menu */}
        <div className="flex-grow flex justify-start">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Estadisticas</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {navItems.map((item) => (
                      <ListItem
                        key={item.title}
                        title={item.title}
                        href={item.href}
                      >
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Login/Logout Button */}
        <div className="flex-shrink-0">
          <Button onClick={handleLoginClick} variant="outline">
            {isLoggedIn ? <span className="flex items-center gap-2">
              Logout
              <LogOut className="w-4 h-4" />
            </span> :
              <span className="flex items-center gap-2">
                Login
                <LogIn className="w-4 h-4" />
              </span>}
          </Button>
        </div>
      </div>

    </div>
  )
}

export { Navbar }

