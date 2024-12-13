'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProductSchema, UpdateProductSchema } from "@/lib/schemas/products/update-product-schema";
import { Product } from "@/types/api/interfaces";
import { Label } from "@radix-ui/react-label";
import { ErrorMessage, Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { toFormikValidationSchema } from "zod-formik-adapter";


interface UpdateProductFormProps {
  product: Product;
  onSubmit: (values: UpdateProductSchema, { setSubmitting }: FormikHelpers<UpdateProductSchema>) => void;
}

export function UpdateProductForm({ product, onSubmit }: UpdateProductFormProps) {
  const router = useRouter();

  const initialValues: UpdateProductSchema = {
    productId: product.id,
    name: product.name,
    price: product.price,
    quantity: product.quantity,
    measure: product.measure,
    brand: product.brand,
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={toFormikValidationSchema(updateProductSchema)}
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