'use client';
import { Button } from "@/components/ui/button";
import { logout, selectIsValidSession } from "@/lib/features/auth/auth-slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export function LogoutForm() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsValidSession);

  // Only redirect if the user is not logged in when the page loads
  useEffect(() => {
    if (!isLoggedIn) {
      redirect('/login');
    } else {
      dispatch(logout());
    }
  }, []);

  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-4 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto h-12 w-12 text-green-500"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <h1 className="text-2xl font-semibold tracking-tight">
            ¡Gracias por usar GVM!
          </h1>
          <p className="text-muted-foreground">
            Su sesión ha sido cerrada correctamente
          </p>
          <p className="text-sm text-muted-foreground">
            Lo esperamos pronto nuevamente
          </p>
          <Link
            href="/login"
          >
            <Button variant="default">
              Volver a iniciar sesión
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
