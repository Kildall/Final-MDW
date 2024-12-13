'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProductSchema, CreateProductSchema } from "@/lib/schemas/products/create-product-schema";
import { Label } from "@radix-ui/react-label";
import { ErrorMessage, Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { toFormikValidationSchema } from "zod-formik-adapter";


interface CreateProductFormProps {
  onSubmit: (values: CreateProductSchema, { setSubmitting }: FormikHelpers<CreateProductSchema>) => void;
}

export function CreateProductForm({ onSubmit }: CreateProductFormProps) {
  const router = useRouter();

  const initialValues: CreateProductSchema = {
    name: "",
    price: 0,
    quantity: 0,
    measure: 0,
    brand: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={toFormikValidationSchema(createProductSchema)}
      enableReinitialize
    >
      {({ values, handleChange, isSubmitting }) => (
        <Form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre del Producto</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
              />
              <ErrorMessage name="name" component={Label} className="text-red-500" />
            </div>

            <div>
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={values.price}
                onChange={handleChange}
              />
              <ErrorMessage name="price" component={Label} className="text-red-500" />
            </div>

            <div>
              <Label htmlFor="quantity">Cantidad</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={values.quantity}
                onChange={handleChange}
              />
              <ErrorMessage name="quantity" component={Label} className="text-red-500" />
            </div>

            <div>
              <Label htmlFor="measure">Medida</Label>
              <Input
                id="measure"
                name="measure"
                type="number"
                value={values.measure}
                onChange={handleChange}
              />
              <ErrorMessage name="measure" component={Label} className="text-red-500" />
            </div>

            <div>
              <Label htmlFor="brand">Marca</Label>
              <Input
                id="brand"
                name="brand"
                type="text"
                value={values.brand}
                onChange={handleChange}
              />
              <ErrorMessage name="brand" component={Label} className="text-red-500" />
            </div>
          </div>

          <div className="flex flex-row justify-between gap-4">
            <Button
              type="button"
              className="w-72 bg-destructive"
              onClick={() => router.push("/products/list")}
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