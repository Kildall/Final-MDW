'use client'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ListItem } from "@/components/ui/navbar/list-item"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navbar/navigation-menu"
import { selectIsValidSession, selectUser } from "@/lib/features/auth/auth-slice"
import { useAppSelector } from "@/lib/hooks"
import { LogIn, LogOut } from 'lucide-react'
import Image from 'next/image'
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
  const isLoggedIn = useAppSelector(selectIsValidSession);
  const user = useAppSelector(selectUser);
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
            className="cursor-pointer h-12 w-auto"
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

        <div className="flex-shrink-0 flex flex-row items-center gap-2">
          {user && <Label className="text-white md:block hidden"> Bienvenido, {user.name}</Label>}
          <Link href={isLoggedIn ? "/logout" : "/login"}>
            <Button variant="outline">
              {isLoggedIn ? <span className="flex items-center gap-2">
                Logout
                <LogOut className="w-4 h-4" />
              </span> :
                <span className="flex items-center gap-2">
                  Login
                  <LogIn className="w-4 h-4" />
                </span>}
            </Button>
          </Link>
        </div>
      </div>

    </div>
  )
}

export { Navbar }

