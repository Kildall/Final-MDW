import { SalesStats } from "@/components/landing/sales-stats";
import { DeliveriesStats } from "@/components/landing/deliveries-stats";
export default function Home() {
  return (
    <main className="flex flex-col gap-4 py-20">
      {/* Stats Section */}
      <h1 className="text-6xl font-bold text-center font-doto">Estadisticas Generales</h1>
      <SalesStats />
      <DeliveriesStats />
    </main>
  );
}
