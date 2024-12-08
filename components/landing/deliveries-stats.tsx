'use client';

import { useAppSelector } from "@/lib/hooks";
import { TotalSalesCard } from "@/components/landing/cards/sales/total-sales-card";
import { AverageSalesCard } from "@/components/landing/cards/sales/average-sales-card";
import { CancelledSalesCard } from "@/components/landing/cards/sales/cancelled-sales-card";
import { Delivery } from "@/types/api/interfaces";
import { CompletedDeliveriesCard } from "./cards/deliveries/completed-deliveries";
import { InTransitDeliveriesCard } from "./cards/deliveries/in-transit-deliveries-card";
import { TotalProductsDeliveriesCard } from "./cards/deliveries/total-products-deliveries-card";
import { logger } from "@/lib/logger";

function generateDeliveriesCards(deliveries: Delivery[]): React.ReactNode[] {

  let completed = 0;
  let inTransit = 0;
  let totalProductsInTransit = 0;

  for (const delivery of deliveries) {
    if (delivery.status === 'FINISHED') completed++;
    if (delivery.status === 'IN_TRANSIT') inTransit++;

    if (!delivery.sale || !delivery.sale.products) {
      logger.warn(`Delivery ${delivery.id} has no sale or sale has no products`, { delivery });
      continue;
    };
    for (const product of delivery.sale.products) {
      totalProductsInTransit += product.quantity;
    }
  }

  const completedDeliveriesCard = CompletedDeliveriesCard(completed, deliveries.length);
  const inTransitDeliveriesCard = InTransitDeliveriesCard(inTransit, deliveries.length);
  const totalProductsInTransitCard = TotalProductsDeliveriesCard(totalProductsInTransit, deliveries.length);

  const cards = [completedDeliveriesCard, inTransitDeliveriesCard, totalProductsInTransitCard];

  return cards;
}

function DeliveriesStats() {
  const deliveries = useAppSelector(state => state.deliveries.deliveries);
  const deliveriesStats = generateDeliveriesCards(deliveries);

  return (
    <section className="flex flex-col gap-4 py-8">
      <h2 className="text-4xl font-bold text-left font-doto">Entregas</h2>
      <h3 className="text-2xl font-light text-left">Resumen del estado actual de las entregas</h3>
      <div className="flex flex-row justify-center items-center">
        <div className="flex flex-row gap-5 max-w-4xl w-full">
          {
            deliveriesStats.map((cardStat, index) => (
              <div key={`deliveries-stat-${index}`} className="md:basis-1/2 lg:basis-1/3 p-2">
                {cardStat}
              </div>
            ))
          }
        </div>
      </div>
    </section>
  )
}

export { DeliveriesStats };