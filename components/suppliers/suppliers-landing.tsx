"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppSelector } from "@/lib/hooks";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { SuppliersStats } from "../landing/suppliers-stats";

export function SuppliersLanding() {
  const suppliers = useAppSelector((state) => state.suppliers.suppliers);
  debugger;
  return (
    <div>
      <SuppliersStats suppliers={suppliers} />
      <section className="flex flex-col gap-4 py-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-left font-n doto">
          Acciones relacionadas con los proveedores
        </h2>
        <h3 className="text-lg sm:text-xl md:text-2xl font-light text-left">
          Puedes crear o eliminar un proveedor
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
          <Link href="/sales/list" className="group relative">
            <Card className="h-48">
              <CardHeader>
                <CardTitle>Ver todos los proveedores</CardTitle>
                <CardDescription>
                  Consulta el registro histórico de las ventas realizadas
                </CardDescription>
              </CardHeader>
              <CardFooter className="absolute bottom-0 right-0">
                <ArrowRightIcon className="opacity-50 group-hover:opacity-100 transition-opacity duration-300 w-8 h-8" />
              </CardFooter>
            </Card>
          </Link>
          <Link href="/sales/create" className="group relative">
            <Card className="h-48">
              <CardHeader>
                <CardTitle>Crear una venta</CardTitle>
                <CardDescription>Crea una nueva venta</CardDescription>
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
