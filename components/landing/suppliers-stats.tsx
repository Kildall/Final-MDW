import { InactiveSuppliersCard } from "@/components/landing/cards/suppliers/inactive-suppliers-card";
import { TopSuppliersCard } from "@/components/landing/cards/suppliers/top-suppliers-card";
import { TotalSuppliersCard } from "@/components/landing/cards/suppliers/total-suppliers-card";
import { Supplier } from "@/types/api/interfaces";

interface SuppliersStatsProps {
  suppliers: Supplier[];
}

function SuppliersStats({ suppliers }: SuppliersStatsProps) {
  const totalSuppliers = suppliers.length;
  let inactiveSuppliers = 0;
  const topSuppliers: { name: string; purchaseCount: number }[] = [];

  // Procesar métricas de proveedores
  for (const supplier of suppliers) {
    if (!supplier.enabled) {
      inactiveSuppliers++;
    }

    const purchaseCount = supplier.purchases?.length || 0;
    if (purchaseCount > 0) {
      topSuppliers.push({ name: supplier.name, purchaseCount });
    }
  }

  // Ordenar top suppliers por número de compras (descendente)
  topSuppliers.sort((a, b) => b.purchaseCount - a.purchaseCount);

  const totalSuppliersCard = (
    <TotalSuppliersCard
      totalPurchases={topSuppliers.reduce((sum, s) => sum + s.purchaseCount, 0)}
      enabledSuppliers={totalSuppliers - inactiveSuppliers}
    />
  );

  const inactiveSuppliersCard = (
    <InactiveSuppliersCard inactiveSuppliers={inactiveSuppliers} />
  );

  const topSuppliersCard = (
    <TopSuppliersCard topSuppliers={topSuppliers.slice(0, 3)} />
  );

  return (
    <section className="flex flex-col gap-4 py-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-left font-doto">
        Proveedores
      </h2>
      <h3 className="text-lg sm:text-xl md:text-2xl font-light text-left">
        Resumen de los proveedores, en el mejor detalle posible
      </h3>
      <div className="flex flex-col md:flex-row justify-center items-center">
        <div className="flex flex-col md:flex-row gap-5 max-w-5xl w-full">
          {[totalSuppliersCard, inactiveSuppliersCard, topSuppliersCard].map(
            (cardStat, index) => (
              <div
                key={`suppliers-stat-${index}`}
                className="md:basis-1/2 lg:basis-1/3 p-2"
              >
                {cardStat}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

export { SuppliersStats };
