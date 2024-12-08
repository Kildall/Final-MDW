'use client';

import { useAppSelector } from "@/lib/hooks";
import { Product } from "@/types/api/interfaces";
import { BrandsVarietyProductsCard } from "./cards/products/brands-variety-products-card";
import { InventoryValueProductsCard } from "./cards/products/inventory-value-products-card";
import { ProductsInStockCard } from "./cards/products/products-in-stock-card";

function generateProductsCards(products: Product[]): React.ReactNode[] {

  const seenBrands = new Set<string>();
  let inventoryValue = 0;
  let productsInStock = 0;
  let maxQuantity = -Infinity;
  let productWithMostStock = '';

  for (const product of products) {
    seenBrands.add(product.brand);
    inventoryValue += product.price * product.quantity;
    productsInStock += product.quantity;

    if (product.quantity > maxQuantity) {
      maxQuantity = product.quantity;
      productWithMostStock = product.name;
    }
  }

  const brandVarietyCard = BrandsVarietyProductsCard(seenBrands.size, productsInStock);
  const inventoryValueCard = InventoryValueProductsCard(inventoryValue, productsInStock);
  const productsInStockCard = ProductsInStockCard(productsInStock, productWithMostStock);

  const cards = [brandVarietyCard, inventoryValueCard, productsInStockCard];

  return cards;
}

function ProductsStats() {
  const products = useAppSelector(state => state.products.products);
  const productsStats = generateProductsCards(products);

  return (
    <section className="flex flex-col gap-4 py-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-left font-doto">Productos</h2>
      <h3 className="text-lg sm:text-xl md:text-2xl font-light text-left">Información detallada del inventario disponible</h3>
      <div className="flex flex-col md:flex-row justify-center items-center">
        <div className="flex flex-col md:flex-row gap-5 max-w-5xl w-full">
          {
            productsStats.map((cardStat, index) => (
              <div key={`products-stat-${index}`} className="md:basis-1/2 lg:basis-1/3 p-2">
                {cardStat}
              </div>
            ))
          }
        </div>
      </div>
    </section>
  )
}

export { ProductsStats };
