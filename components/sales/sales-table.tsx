'use client';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { DELIVERY_STATUS } from "@/helpers/delivery-status";
import { useToast } from "@/hooks/use-toast";
import { deleteSale, fetchSales } from "@/lib/features/sales/sales-slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ArrowRightIcon, Package, Truck } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { DeleteSaleDialog } from "./sales-dialogs/delete-sale-dialog";

export function SalesTable() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const sales = useAppSelector((state) => state.sales.sales);

  useEffect(() => {
    dispatch(fetchSales());
  }, [dispatch]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  async function handleDelete(id: number) {
    const result = await dispatch(deleteSale(id));
    if (result.meta.requestStatus === "fulfilled") {
      toast({
        title: "Venta eliminada",
        description: "La venta ha sido eliminada correctamente.",
      });
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Productos</TableHead>
          <TableHead>Entregas</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead className="text-center">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.map((sale) => (
          <TableRow key={sale.id}>
            <TableCell className="font-medium">{sale.id}</TableCell>
            <TableCell>{new Date(sale.startDate).toLocaleDateString()}</TableCell>
            <TableCell>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    <Package className="w-4 h-4 mr-2" />
                    {sale.products?.length ?? 0} productos
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">Detalle de productos</h4>
                    <div className="max-h-48 overflow-y-auto">
                      {sale.products?.map((product) => (
                        <div key={product.productId} className="flex justify-between py-1 border-b">
                          <span className="text-sm">{product.product?.name}</span>
                          <div className="text-sm">
                            <span className="mr-2">{product.quantity}x</span>
                            <span className="text-muted-foreground">
                              {formatCurrency(product.quantity * (product.product?.price ?? 0))}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>
                          {formatCurrency(
                            sale.products?.reduce(
                              (acc, product) => acc + product.quantity * (product.product?.price ?? 0),
                              0
                            ) ?? 0
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </TableCell>
            <TableCell>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    <Truck className="w-4 h-4 mr-2" />
                    {sale.deliveries?.length ?? 0} entregas
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">Detalle de entregas</h4>
                    <div className="max-h-48 overflow-y-auto">
                      {sale.deliveries?.map((delivery) => (
                        <div key={delivery.id} className="py-2 border-b last:border-0">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Entrega #{delivery.id}</span>
                            <span className="text-sm text-muted-foreground">{DELIVERY_STATUS[delivery.status]}</span>
                          </div>
                          {delivery.address && (
                            <div className="mt-1 text-sm text-muted-foreground">
                              {`${delivery.address.street1}, ${delivery.address.city}, ${delivery.address.state}`}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </TableCell>
            <TableCell>
              {formatCurrency(
                sale.products?.reduce(
                  (acc, product) => acc + product.quantity * (product.product?.price ?? 0),
                  0
                ) ?? 0
              )}
            </TableCell>
            <TableCell>{sale.customer?.name}</TableCell>
            <TableCell className="flex justify-center gap-2">
              <Link href={`/sales/${sale.id}`}>
                <Button variant="outline" size="icon">
                  <ArrowRightIcon className="w-4 h-4" />
                </Button>
              </Link>
              <DeleteSaleDialog onDelete={() => handleDelete(sale.id)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {sales.length > 0 && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total de ventas</TableCell>
            <TableCell colSpan={3} className="text-right">
              {sales.length}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={4}>Total de productos</TableCell>
            <TableCell colSpan={3} className="text-right">
              {sales.reduce((acc, sale) => acc + (sale.products?.reduce((acc, product) => acc + product.quantity, 0) ?? 0), 0)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={4}>Total de ingresos</TableCell>
            <TableCell colSpan={3} className="text-right">
              {formatCurrency(
                sales.reduce(
                  (acc, sale) => acc + (sale.products?.reduce((acc, product) => acc + product.quantity * (product.product?.price ?? 0), 0) ?? 0),
                  0
                )
              )}
            </TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
}

export default SalesTable;