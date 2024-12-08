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

const salesNavMenuItems: NavItem[] = [
  {
    title: "Dashboard de Ventas",
    href: "/sales",
    description: "Visualiza y gestiona todas tus ventas en un solo lugar",
  },
  {
    title: "Crear Venta",
    href: "/sales/create",
    description: "Crea una nueva venta",
  },
  {
    title: "Listado de Ventas",
    href: "/sales/list",
    description: "Ve todos tus ventas",
  }
]

const deliveryNavMenuItems: NavItem[] = [
  {
    title: "Dashboard de Entregas",
    href: "/deliveries",
    description: "Visualiza y gestiona todas tus entregas en un solo lugar",
  },
  {
    title: "Listado de Entregas",
    href: "/deliveries/list",
    description: "Ve todos tus envíos",
  }
]

const productsNavMenuItems: NavItem[] = [
  {
    title: "Listado de Productos",
    href: "/products/list",
    description: "Ve todos tus productos",
  }
]

const suppliersNavMenuItems: NavItem[] = [
  {
    title: "Dashboard de Proveedores",
    href: "/suppliers",
    description: "Visualiza y gestiona todos tus proveedores en un solo lugar",
  },
  {
    title: "Crear Proveedor",
    href: "/suppliers/create",
    description: "Crea un nuevo proveedor",
  },
  {
    title: "Listado de Proveedores",
    href: "/suppliers/list",
    description: "Ve todos tus proveedores",
  }
]

function Navbar() {
  const isLoggedIn = useAppSelector(selectIsValidSession);
  const user = useAppSelector(selectUser);
  return (
    <div className="w-full h-20 bg-primary flex items-center justify-between px-4">
      <div className="flex items-center w-full max-w-7xl m-auto justify-between">
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

        {/* Logged in Items */}
        {isLoggedIn && (
          <NavigationMenu>
            <NavigationMenuList className="flex flex-row gap-4">
              <NavigationMenuItem>
                <NavigationMenuTrigger>Ventas</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {salesNavMenuItems.map((item) => (
                      <ListItem key={item.title} href={item.href} title={item.title}>
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Proveedores</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {suppliersNavMenuItems.map((item) => (
                      <ListItem key={item.title} href={item.href} title={item.title}>
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Productos</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {productsNavMenuItems.map((item) => (
                      <ListItem key={item.title} href={item.href} title={item.title}>
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Entregas</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {deliveryNavMenuItems.map((item) => (
                      <ListItem key={item.title} href={item.href} title={item.title}>
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}

        {/* Login/Logout */}
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

