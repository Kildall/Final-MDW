'use client';
import { DeliveriesStats } from "@/components/landing/deliveries-stats";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export function DeliveriesLanding() {
  return (
    <div>
      <DeliveriesStats />
      <section className="flex flex-col gap-4 py-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-left font-doto">Acciones relacionadas con las entregas</h2>
        <h3 className="text-lg sm:text-xl md:text-2xl font-light text-left">Puedes crear una entrega o consultar el historial de entregas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
          <Link href="/deliveries/list" className="group relative">
            <Card className="h-48">
              <CardHeader>
                <CardTitle>Ver todas las entregas
                </CardTitle>
                <CardDescription>
                  Consulta el registro histórico de las entregas
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
