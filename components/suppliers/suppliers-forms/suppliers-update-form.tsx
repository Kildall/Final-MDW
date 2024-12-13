'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateSupplierSchema, UpdateSupplierSchema } from "@/lib/schemas/suppliers/update-supplier-schema";
import { Supplier } from "@/types/api/interfaces";
import { Label } from "@radix-ui/react-label";
import { ErrorMessage, Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { toFormikValidationSchema } from "zod-formik-adapter";


interface UpdateSupplierFormProps {
  supplier: Supplier;
  onSubmit: (values: UpdateSupplierSchema, { setSubmitting }: FormikHelpers<UpdateSupplierSchema>) => void;
}

export function UpdateSupplierForm({ supplier, onSubmit }: UpdateSupplierFormProps) {
  const router = useRouter();

  const initialValues: UpdateSupplierSchema = {
    supplierId: supplier.id,
    name: supplier.name,
    enabled: supplier.enabled,
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={toFormikValidationSchema(updateSupplierSchema)}
      enableReinitialize
    >
      {({ values, handleChange, isSubmitting }) => (
        <Form className="space-y-6">
          <div className="grid grid-cols-1 gap-4 max-w-md">
            <div>
              <Label htmlFor="name">Nombre del Proveedor</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
              />
              <ErrorMessage name="name" component={Label} className="text-red-500" />
            </div>
          </div>

          <div className="flex flex-row justify-between gap-4">
            <Button
              type="button"
              className="w-72 bg-destructive"
              onClick={() => router.push("/suppliers/list")}
            >
              Volver
            </Button>
            <Button
              type="submit"
              className="w-72 bg-teal-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}