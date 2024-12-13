'use client';
import { DeleteSupplierDialog } from "@/components/suppliers/suppliers-dialogs/delete-supplier-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { deleteSupplier, fetchSuppliers } from "@/lib/features/suppliers/suppliers-slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";


export function SuppliersTable() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, []);

  function handleDelete(id: number) {
    dispatch(deleteSupplier(id));
    toast({
      title: "Proveedor eliminado",
      description: "El proveedor ha sido eliminado correctamente.",
    });
  }

  const suppliers = useAppSelector((state) => state.suppliers.suppliers);
  return (
    <Table>
      <TableCaption>Lista de proveedores disponibles.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-center w-[150px]">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {suppliers.map((supplier) => (
          <TableRow key={supplier.id}>
            <TableCell className="font-medium">{supplier.name}</TableCell>
            <TableCell>{supplier.enabled ? "Activo" : "Inactivo"}</TableCell>
            <TableCell className="flex justify-center gap-2">
              <Link href={`/suppliers/${supplier.id}`}>
                <Button variant="outline" size="icon">
                  <ArrowRightIcon className="w-4 h-4" />
                </Button>
              </Link>
              <DeleteSupplierDialog onDelete={() => handleDelete(supplier.id)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {suppliers.length > 0 && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total de proveedores</TableCell>
            <TableCell colSpan={1} className="text-right">
              {suppliers.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
}
