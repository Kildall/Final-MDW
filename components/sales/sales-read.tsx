'use client';
import { selectSaleById } from "@/lib/features/sales/sales-slice";
import { useAppSelector } from "@/lib/hooks";


interface SalesReadProps {
  id: number;
}

export function SalesRead({ id }: SalesReadProps) {
  const sale = useAppSelector((state) => selectSaleById(state, id));

  return (
    <>
      {sale ? (
        <div>
          <h1>Sale {id}</h1>
          <p>{sale?.id}</p>
          <p>{new Date(sale?.startDate).toLocaleDateString()}</p>
          <p>{sale?.products?.length}</p>
        </div>
      ) : (
        <div>Sale not found</div>
      )}
    </>
  );
}
