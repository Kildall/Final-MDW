import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { fetchCustomerById, selectCustomerById } from "@/lib/features/customers/customers-slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { CreateSaleSchema, createSaleSchema } from "@/lib/schemas/sales/create-sale-schema";
import { Customer, Employee, Product } from "@/types/api/interfaces";
import { Label } from "@radix-ui/react-label";
import { ErrorMessage, Field, FieldArray, FieldProps, Form, Formik, FormikHelpers } from "formik";
import { Info, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";

interface SalesFormProps {
  products: Product[];
  employees: Employee[];
  customers: Customer[];
  onSubmit: (values: CreateSaleSchema, { setSubmitting }: FormikHelpers<CreateSaleSchema>) => void;
}

export function CreateSaleForm({ products, employees, customers, onSubmit }: SalesFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const initialValues: CreateSaleSchema = {
    customerId: 0,
    products: [],
    deliveries: [],
    employeeId: 0,
    startDate: new Date(new Date().getTime() + 30 * 60000).toISOString(),
  };

  return (
    <TooltipProvider>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={toFormikValidationSchema(createSaleSchema)}
        enableReinitialize
      >
        {({ values, isSubmitting, setFieldValue }) => {
          // Get customer from Redux store using the current customerId from form values
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const customer = useAppSelector((state) =>
            selectCustomerById(state, values.customerId !== 0 ? values.customerId : undefined)
          );

          // Fetch customer data when customerId changes
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useEffect(() => {
            if (!isNaN(values.customerId) && values.customerId > 0) {
              dispatch(fetchCustomerById(values.customerId));
            }
          }, [values.customerId, dispatch]);

          return (
            <Form className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerId">Cliente</Label>
                  <Field name="customerId">
                    {({ field }: FieldProps) => (
                      <Select
                        value={field.value?.toString() || ""}
                        onValueChange={(value) => {
                          const customerId = parseInt(value);
                          setFieldValue('customerId', customerId);
                          setFieldValue('deliveries', values.deliveries?.map((delivery) => ({
                            ...delivery,
                            addressId: 0
                          })) || []);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar cliente">
                            {customers.find(c => c.id === field.value)?.name || "Seleccionar cliente"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id.toString()}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage name="customerId" component={Label} className="text-red-500" />
                </div>

                <div>
                  <Label htmlFor="employeeId">Empleado</Label>
                  <Field name="employeeId">
                    {({ field }: FieldProps) => (
                      <Select
                        value={field.value?.toString()}
                        onValueChange={(value) => field.onChange({
                          target: { name: 'employeeId', value: parseInt(value) }
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
                  <ErrorMessage name="employeeId" component={Label} className="text-red-500" />
                </div>

                <div>
                  <Label htmlFor="startDate">Fecha de Inicio</Label>
                  <Field name="startDate">
                    {({ field }: FieldProps) => (
                      <DateTimePicker
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={(date) => {
                          field.onChange({
                            target: { name: 'startDate', value: date ? date.toISOString() : "" }
                          });
                        }}
                      />
                    )}
                  </Field>
                  <ErrorMessage name="startDate" component={Label} className="text-red-500" />
                </div>
              </div>

              {/* Products Section */}
              <div className="space-y-2">
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

                <FieldArray name="products">
                  {({ push, remove }) => (
                    <div className="space-y-2">
                      {values.products.map((product, index) => (
                        <div key={index} className="flex gap-4 items-end">
                          <div className="flex-1">
                            <Label htmlFor={`products.${index}.productId`}>Producto</Label>
                            <Field name={`products.${index}.productId`}>
                              {({ field }: FieldProps) => (
                                <Select
                                  value={field.value?.toString()}
                                  onValueChange={(value) => {
                                    field.onChange({
                                      target: {
                                        name: `products.${index}.productId`,
                                        value: parseInt(value)
                                      }
                                    });
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar producto" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {products.map((p) => (
                                      <SelectItem key={p.id} value={p.id.toString()}>
                                        {p.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </Field>
                            <ErrorMessage
                              name={`products.${index}.productId`}
                              component={Label}
                              className="text-red-500"
                            />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor={`products.${index}.quantity`}>Cantidad</Label>
                            <Field
                              name={`products.${index}.quantity`}
                              placeholder="Cantidad"
                              type="number"
                              as={Input}
                            />
                            <ErrorMessage
                              name={`products.${index}.quantity`}
                              component={Label}
                              className="text-red-500"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => push({ productId: -1, quantity: 1 })}
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
              <div className="space-y-2">
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
                    <div className="space-y-2">
                      {values.deliveries.map((delivery, index) => (
                        <div key={index} className="border p-4 rounded-lg space-y-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor={`deliveries.${index}.employeeId`}>
                                Empleado
                              </Label>
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
                              <ErrorMessage
                                name={`deliveries.${index}.employeeId`}
                                component={Label}
                                className="text-red-500"
                              />
                            </div>

                            <div>
                              <Label htmlFor={`deliveries.${index}.addressId`}>
                                Dirección
                              </Label>
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
                                    disabled={!customer}
                                  >
                                    <SelectTrigger>
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
                              <ErrorMessage
                                name={`deliveries.${index}.addressId`}
                                component={Label}
                                className="text-red-500"
                              />
                            </div>

                            <div>
                              <Label htmlFor={`deliveries.${index}.startDate`}>
                                Fecha de Inicio
                              </Label>
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
                              <ErrorMessage
                                name={`deliveries.${index}.startDate`}
                                component={Label}
                                className="text-red-500"
                              />
                            </div>
                          </div>

                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar Entrega
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        disabled={!customer}
                        onClick={() => push({
                          employeeId: -1,
                          addressId: -1,
                          startDate: new Date(new Date().getTime() + 30 * 60000).toISOString()
                        })}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Entrega
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </div>

              <div className="flex flex-row justify-between gap-4">
                <Button
                  type="button"
                  variant="destructive"
                  className="w-72"
                  onClick={() => router.push("/sales/list")}
                >
                  Volver
                </Button>
                <Button
                  className="w-72"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </Form>
          )
        }}
      </Formik>
    </TooltipProvider>
  );
}