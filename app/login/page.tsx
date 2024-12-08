import { Metadata } from "next";

import { LoginForm } from "@/components/login/login-form";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

export const metadata: Metadata = {
  title: "Login",
  description: "Iniciar sesión",
}

export default function LoginPage() {
  return (
    <div className="container relative flex flex-1 flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex rounded-lg">
        <div className="absolute inset-0 bg-zinc-900 overflow-hidden rounded-lg">
          <FlickeringGrid
            className="z-0 absolute inset-0 size-full p-1"
            squareSize={4}
            gridGap={6}
            color="#1d68c3"
            maxOpacity={0.3}
            flickerChance={0.05}
            height={850}
            width={850}
          />
        </div>
        <div className="relative z-1 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Gestor de Ventas y Mercadería
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;GVM me ha entregado un valor como ninguna otra aplicación de gestión nunca me ha entregado...&rdquo;
            </p>
            <footer className="text-sm">Lucio Perez</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8 w-full">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Iniciar sesión
            </h1>
            <p className="text-sm text-muted-foreground">
              Ingrese su email y contraseña
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}