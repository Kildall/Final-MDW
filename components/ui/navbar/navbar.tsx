'use client'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ListItem } from "@/components/ui/navbar/list-item"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navbar/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { selectIsValidSession, selectUser } from "@/lib/features/auth/auth-slice"
import { useAppSelector } from "@/lib/hooks"
import { LogIn, LogOut, Menu } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from "next/navigation"
import { useState } from "react"

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
    title: "Dashboard de Productos",
    href: "/products",
    description: "Visualiza y gestiona todos tus productos en un solo lugar",
  },
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
    title: "Listado de Proveedores",
    href: "/suppliers/list",
    description: "Ve todos tus proveedores",
  }
]

const allNavItems = {
  Ventas: salesNavMenuItems,
  Proveedores: suppliersNavMenuItems,
  Productos: productsNavMenuItems,
  Entregas: deliveryNavMenuItems,
}

function MainNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex flex-row gap-4">
        {Object.entries(allNavItems).map(([section, items]) => (
          <NavigationMenuItem key={section}>
            <NavigationMenuTrigger>{section}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {items.map((item) => (
                  <ListItem key={item.title} href={item.href} title={item.title}>
                    {item.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function Navbar() {
  const isLoggedIn = useAppSelector(selectIsValidSession);
  const user = useAppSelector(selectUser);
  const pathname = usePathname();
  const isLoginPage = pathname.endsWith("/login");
  const [open, setOpen] = useState(false)

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
            className="cursor-pointer h-10 xl:h-12 w-auto"
          />
        </Link>

        {/* Main Navigation - Only shown when logged in */}
        {isLoggedIn && <div className="hidden lg:block"><MainNav /></div>}

        {/* Right side: Welcome message and Menu/Login button */}
        <div className="flex items-center gap-4">
          {isLoggedIn && user && (
            <Label className="text-white hidden lg:block">
              Bienvenido, {user.name}
            </Label>
          )}

          {isLoggedIn && (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-4 mt-8">
                  {user && (
                    <div className="pb-4 border-b">
                      <p className="text-lg font-semibold">Bienvenido,</p>
                      <p>{user.name}</p>
                    </div>
                  )}
                  {Object.entries(allNavItems).map(([section, items]) => (
                    <div key={section} className="flex flex-col gap-2">
                      <h2 className="font-semibold text-lg">{section}</h2>
                      {items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="text-sm hover:underline"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  ))}
                  <div className="mt-auto pt-4 border-t">
                    <Link href="/logout" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Cerrar Sesión
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}

          {!isLoggedIn ? (
            <>
              {!isLoginPage && <Link href="/login">
                <Button variant="outline" size="icon">
                  <LogIn className="h-6 w-6" />
                </Button>
              </Link>}
            </>
          ) : (
            <Link href="/logout">
              <Button variant="outline" size="icon" className="hidden lg:flex" title="Cerrar Sesión">
                <LogOut className="h-6 w-6" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export { Navbar }
