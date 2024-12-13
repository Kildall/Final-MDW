import { TotalSuppliersCard } from "@/components/landing/cards/suppliers/total-suppliers-card";
import { useAppSelector } from "@/lib/hooks";
import { Supplier } from "@/types/api/interfaces";

function generateSuppliersCards(suppliers: Supplier[]): React.ReactNode[] {
  const totalSuppliers = suppliers.length;

  const totalSuppliersCard = (
    <TotalSuppliersCard
      totalSuppliers={totalSuppliers}
    />
  );

  const cards = [totalSuppliersCard];

  return cards;
}

function SuppliersStats() {
  const suppliers = useAppSelector(state => state.suppliers.suppliers);
  const suppliersStats = generateSuppliersCards(suppliers);

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
          {
            suppliersStats.map((cardStat, index) => (
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
