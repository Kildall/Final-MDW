'use client';
import { SuppliersStats } from "@/components/landing/suppliers-stats";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export function SuppliersLanding() {
  return (
    <div>
      <SuppliersStats />
      <section className="flex flex-col gap-4 py-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-left font-doto">Acciones relacionadas con los proveedores</h2>
        <h3 className="text-lg sm:text-xl md:text-2xl font-light text-left">Puedes crear un proveedor o consultar el historial de proveedores</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
          <Link href="/suppliers/list" className="group relative">
            <Card className="h-48">
              <CardHeader>
                <CardTitle>Ver todos los proveedores
                </CardTitle>
                <CardDescription>
                  Consulta el registro histórico de los proveedores
                </CardDescription>
              </CardHeader>
              <CardFooter className="absolute bottom-0 right-0">
                <ArrowRightIcon className="opacity-50 group-hover:opacity-100 transition-opacity duration-300 w-8 h-8" />
              </CardFooter>
            </Card>
          </Link>
          <Link href="/suppliers/create" className="group relative">
            <Card className="h-48" >
              <CardHeader>
                <CardTitle>
                  Crear un proveedor
                </CardTitle>
                <CardDescription>
                  Crea un nuevo proveedor
                </CardDescription>
              </CardHeader>
              <CardFooter className="absolute bottom-0 right-0">
                <ArrowRightIcon className="opacity-50 group-hover:opacity-100 transition-opacity duration-300 w-8 h-8" />
              </CardFooter>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}
