'use client';

import { AverageSalesCard } from "@/components/landing/cards/sales/average-sales-card";
import { CancelledSalesCard } from "@/components/landing/cards/sales/cancelled-sales-card";
import { TotalSalesCard } from "@/components/landing/cards/sales/total-sales-card";
import { useAppSelector } from "@/lib/hooks";
import { Sale } from "@/types/api/interfaces";

function generateSalesCards(sales: Sale[]): React.ReactNode[] {

  let total = 0;
  let cancelled = 0;
  let average = 0;



  for (const sale of sales) {
    if (sale.status === 'CANCELLED') cancelled++;
    if (!sale.products || sale.products.length === 0) continue;
    for (const product of sale.products) {
      if (!product.product) continue;
      total += product.quantity * product.product.price;
    }
  }

  if (sales.length > 0) {
    average = total / sales.length;
  }

  const totalSalesCard = TotalSalesCard(total, sales.length);
  const cancelledSalesCard = CancelledSalesCard(cancelled, sales.length);
  const averageSalesCard = AverageSalesCard(average, sales.length);

  const cards = [totalSalesCard, cancelledSalesCard, averageSalesCard];

  return cards;
}

function SalesStats() {
  const sales = useAppSelector(state => state.sales.sales);
  const salesStats = generateSalesCards(sales);

  return (
    <section className="flex flex-col gap-4 py-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-left font-doto">Ventas</h2>
      <h3 className="text-lg sm:text-xl md:text-2xl font-light text-left">Resumen de las ventas dadas, en el mejor detalle posible</h3>
      <div className="flex flex-col md:flex-row justify-center items-center">
        <div className="flex flex-col md:flex-row gap-5 max-w-5xl w-full">
          {
            salesStats.map((cardStat, index) => (
              <div key={`sales-stat-${index}`} className="md:basis-1/2 lg:basis-1/3 p-2">
                {cardStat}
              </div>
            ))
          }
        </div>
      </div>
    </section>
  )
}

export { SalesStats };
