import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SALE_STATUS } from "@/helpers/sale-status";
import { updateSaleSchema, UpdateSaleSchema } from "@/lib/schemas/sales/update-sale-schema";
import { Customer, DeliveryStatusEnum, Employee, Product, Sale, SaleStatusEnum } from "@/types/api/interfaces";
import { Label } from "@radix-ui/react-label";
import { ErrorMessage, Field, FieldArray, FieldProps, Form, Formik, FormikHelpers } from "formik";
import { Info, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toFormikValidationSchema } from "zod-formik-adapter";

interface UpdateSaleFormProps {
  sale: Sale;
  customer: Customer;
  products: Product[];
  employees: Employee[];
  onSubmit: (values: UpdateSaleSchema, { setSubmitting }: FormikHelpers<UpdateSaleSchema>) => void;
}

export function UpdateSaleForm({ sale, customer, products, employees, onSubmit }: UpdateSaleFormProps) {
  const router = useRouter();
  const initialValues: UpdateSaleSchema = {
    saleId: sale.id,
    products: sale.products?.map(x => ({ productId: x.productId, quantity: x.quantity })) ?? [],
    deliveries: sale.deliveries?.map(x => ({
      employeeId: x.employeeId ?? -1,
      addressId: x.addressId,
      startDate: new Date(x.startDate).toISOString(),
      status: x.status
    })) ?? [],
    employeeId: sale.employeeId,
    status: sale.status
  };

  const calculateLineTotal = (productId: number, quantity: number) => {
    const product = products.find(p => p.id === productId);
    return product ? product.price * quantity : 0;
  };

  const calculateTotal = (productList: Array<{ productId: number, quantity: number }>) => {
    return productList.reduce((sum, item) => sum + calculateLineTotal(item.productId, item.quantity), 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  return (
    <TooltipProvider>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={toFormikValidationSchema(updateSaleSchema)}
        enableReinitialize
      >
        {({ values, isSubmitting, setFieldValue }) => (
          <Form className="space-y-6 max-w-6xl mx-auto p-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="id">ID</Label>
                <Field
                  placeholder="ID"
                  type="number"
                  as={Input}
                  value={sale.id}
                  readOnly
                />
              </div>

              <div>
                <Label htmlFor="status">Estado</Label>
                <Field name="status">
                  {({ field }: FieldProps<SaleStatusEnum>) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange({
                        target: { name: 'status', value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue>{SALE_STATUS[field.value] || field.value}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(SALE_STATUS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </Field>
              </div>

              <div>
                <Label htmlFor="customerName">Cliente</Label>
                <Field
                  placeholder="Cliente"
                  type="text"
                  as={Input}
                  value={customer.name}
                  readOnly
                />
              </div>

              <div>
                <Label htmlFor="employeeId">Empleado</Label>
                <Field name="employeeId">
                  {({ field }: FieldProps) => (
                    <Select
                      value={field.value.toString()}
                      onValueChange={(value) => field.onChange({
                        target: { name: 'employeeId', value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar empleado" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id.toString()}>
                            {employee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </Field>
              </div>
            </div>

            {/* Products Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Label>Productos</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Seleccione productos del catálogo y especifique la cantidad
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="text-lg font-semibold">
                  Total: {formatPrice(calculateTotal(values.products))}
                </div>
              </div>

              <FieldArray name="products">
                {({ push, remove }) => (
                  <div className="space-y-4">
                    {values.products.map((product, index) => (
                      <div key={index} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg">
                        <div className="flex-1">
                          <Label htmlFor={`products.${index}.productId`}>Producto</Label>
                          <Field name={`products.${index}.productId`}>
                            {({ field }: FieldProps) => (
                              <Select
                                value={field.value?.toString()}
                                onValueChange={(value) => {
                                  const selectedProduct = products.find(p => p.id.toString() === value);
                                  if (selectedProduct) {
                                    setFieldValue(`products.${index}`, {
                                      productId: selectedProduct.id,
                                      quantity: 1
                                    });
                                  }
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Seleccionar producto" />
                                </SelectTrigger>
                                <SelectContent>
                                  {!products.map(p => p.id).includes(field.value) &&
                                    <SelectItem key={field.value} value={field.value.toString()}>
                                      Producto ha sido eliminado
                                    </SelectItem>
                                  }
                                  {products.filter(p => p.quantity > 0).map((p) => (
                                    <SelectItem
                                      key={p.id}
                                      value={p.id.toString()}
                                      disabled={values.products.some(vp => vp.productId === p.id && vp !== product)}
                                    >
                                      {`${p.name} - ${formatPrice(p.price)}`}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </Field>
                          <ErrorMessage name={`products.${index}.productId`} component={Label} className="text-red-500" />
                        </div>

                        <div className="flex-1">
                          <Label htmlFor={`products.${index}.quantity`}>Cantidad</Label>
                          <Field name={`products.${index}.quantity`}>
                            {({ field }: FieldProps) => {
                              const selectedProduct = products.find(p => p.id === values.products[index].productId);
                              const maxQuantity = selectedProduct?.quantity || 100;

                              return (
                                <div className="flex items-center gap-2">
                                  <div className="flex-1">
                                    <Slider
                                      value={[field.value]}
                                      onValueChange={(value) => {
                                        setFieldValue(`products.${index}.quantity`, value[0]);
                                      }}
                                      disabled={!selectedProduct}
                                      min={1}
                                      max={maxQuantity}
                                      step={1}
                                    />
                                  </div>
                                  <Input
                                    type="number"
                                    min={1}
                                    max={maxQuantity}
                                    disabled={!selectedProduct}
                                    value={field.value}
                                    className="w-20"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                      const value = parseInt(e.target.value) || 1;
                                      setFieldValue(`products.${index}.quantity`, Math.min(Math.max(1, value), maxQuantity));
                                    }}
                                  />
                                </div>
                              );
                            }}
                          </Field>
                          <ErrorMessage name={`products.${index}.quantity`} component={Label} className="text-red-500" />
                        </div>

                        <div className="flex-1">
                          <Label>Subtotal</Label>
                          <Input
                            readOnly
                            value={formatPrice(calculateLineTotal(product.productId, product.quantity))}
                          />
                        </div>

                        <div className="flex items-end">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="destructive"
                                onClick={() => remove(index)}
                                className="w-full sm:w-auto"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Eliminar producto
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      disabled={values.products.length === products.filter(p => p.quantity > 0).length}
                      onClick={() => push({
                        productId: products.find(p =>
                          p.quantity > 0 && !values.products.some(vp => vp.productId === p.id)
                        )?.id || 0,
                        quantity: 1
                      })}
                      className="w-full sm:w-auto"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Producto
                    </Button>
                  </div>
                )}
              </FieldArray>
              <ErrorMessage name="products" component={Label} className="text-red-500" />
            </div>

            {/* Deliveries Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Label>Entregas</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Lista de entregas asociadas a la venta
                  </TooltipContent>
                </Tooltip>
              </div>

              <FieldArray name="deliveries">
                {({ push, remove }) => (
                  <div className="space-y-4">
                    {values.deliveries.map((delivery, index) => (
                      <div key={index} className="border p-4 rounded-lg space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor={`deliveries.${index}.employeeId`}>Empleado</Label>
                            <Field name={`deliveries.${index}.employeeId`}>
                              {({ field }: FieldProps) => (
                                <Select
                                  value={field.value?.toString()}
                                  onValueChange={(value) => {
                                    field.onChange({
                                      target: {
                                        name: `deliveries.${index}.employeeId`,
                                        value: parseInt(value)
                                      }
                                    });
                                  }}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Seleccionar empleado" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {employees.map((employee) => (
                                      <SelectItem key={employee.id} value={employee.id.toString()}>
                                        {employee.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </Field>
                            <ErrorMessage name={`deliveries.${index}.employeeId`} component={Label} className="text-red-500" />
                          </div>

                          <div>
                            <Label htmlFor={`deliveries.${index}.addressId`}>Dirección</Label>
                            <Field name={`deliveries.${index}.addressId`}>
                              {({ field }: FieldProps) => (
                                <Select
                                  value={field.value?.toString()}
                                  onValueChange={(value) => {
                                    field.onChange({
                                      target: {
                                        name: `deliveries.${index}.addressId`,
                                        value: parseInt(value)
                                      }
                                    });
                                  }}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Seleccionar dirección" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {customer?.addresses?.map((address) => (
                                      <SelectItem key={address.id} value={address.id.toString()}>
                                        {address.street1}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </Field>
                            <ErrorMessage name={`deliveries.${index}.addressId`} component={Label} className="text-red-500" />
                          </div>

                          <div>
                            <Label htmlFor={`deliveries.${index}.startDate`}>Fecha de Inicio</Label>
                            <Field name={`deliveries.${index}.startDate`}>
                              {({ field }: FieldProps) => (
                                <DateTimePicker
                                  value={field.value ? new Date(field.value) : undefined}
                                  onChange={(date) => {
                                    field.onChange({
                                      target: {
                                        name: `deliveries.${index}.startDate`,
                                        value: date ? date.toISOString() : ""
                                      }
                                    });
                                  }}
                                />
                              )}
                            </Field>
                            <ErrorMessage name={`deliveries.${index}.startDate`} component={Label} className="text-red-500" />
                          </div>
                        </div>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() => remove(index)}
                              className="w-full sm:w-auto"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar Entrega
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Eliminar esta entrega
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => push({
                        employeeId: -1,
                        addressId: -1,
                        startDate: new Date(new Date().getTime() + 30 * 60000).toISOString(),
                        status: 'CREATED' as DeliveryStatusEnum
                      })}
                      className="w-full sm:w-auto"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Entrega
                    </Button>
                  </div>
                )}
              </FieldArray>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <Button
                type="button"
                variant="destructive"
                className="w-full sm:w-72"
                onClick={() => router.push("/sales/list")}
              >
                Volver
              </Button>
              <Button
                className="w-full sm:w-72 bg-teal-500"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </TooltipProvider>
  );
}

export default UpdateSaleForm;