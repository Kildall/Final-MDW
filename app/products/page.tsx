import { DeliveriesStats } from "@/components/landing/deliveries-stats";
import { ProductsStats } from "@/components/landing/products-stats";
import { SalesStats } from "@/components/landing/sales-stats";
export default function Home() {
  return (
    <main className="flex flex-col gap-4 py-20">
      {/* Stats Section */}
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-center font-doto">
        Estadisticas Generales
      </h1>
      <SalesStats />
      <ProductsStats />
      <DeliveriesStats />
    </main>
  );
}
