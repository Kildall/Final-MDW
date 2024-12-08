// This file was auto-generated by prisma-generator-typescript-interfaces

export type DeliveryStatusEnum = "CREATED" | "ASSIGNED" | "IN_PROGRESS" | "IN_TRANSIT" | "FINISHED" | "CONFLICT" | "CANCELLED";

export type BusinessStatusEnum = "PENDING" | "IN_PROGRESS" | "IN_TRANSIT" | "DELIVERED" | "NOT_DELIVERED" | "IN_RETURN" | "CANCELLED";

export type DriverStatusEnum = "PENDING_PICKUP" | "PICKING_UP" | "IN_TRANSIT" | "TRYING_DELIVERY" | "DELIVERED" | "NOT_DELIVERED" | "IN_RETURN" | "CANCELLED";

export type SaleStatusEnum = "CREATED" | "IN_PROGRESS" | "PREPARING" | "READY" | "IN_DELIVERY" | "DELIVERED" | "CANCELLED";

export type EntityType = "Permission" | "Role";

export type AccountAction = "ACTIVATE" | "RESET_PASSWORD";

export type AuditAction = "CREATE" | "UPDATE" | "DELETE";

export interface Customer {
  id: number;
  name: string;
  phone: string;
  registrationDate: Date;
  enabled: boolean;
  addresses?: Address[];
  sales?: Sale[];
}

export interface Purchase {
  id: number;
  employeeId: number;
  supplierId: number;
  date: Date;
  amount: number;
  description: string;
  employee?: Employee;
  supplier?: Supplier;
  products?: PurchaseProduct[];
}

export interface PurchaseProduct {
  purchaseId: number;
  productId: number;
  quantity: number;
  purchase?: Purchase;
  product?: Product;
}

export interface Address {
  id: number;
  name: string;
  customerId: number;
  street1: string;
  street2: string | null;
  postalCode: string;
  state: string;
  city: string;
  details: string | null;
  enabled: boolean;
  customer?: Customer;
  deliveries?: Delivery[];
}

export interface Supplier {
  id: number;
  name: string;
  enabled: boolean;
  purchases?: Purchase[];
}

export interface Employee {
  id: number;
  name: string;
  position: string;
  enabled: boolean;
  purchases?: Purchase[];
  sales?: Sale[];
  deliveries?: Delivery[];
  user?: User | null;
  userId: number | null;
}

export interface Delivery {
  id: number;
  saleId: number;
  employeeId: number | null;
  addressId: number;
  startDate: Date;
  lastUpdateDate: Date;
  sale?: Sale;
  employee?: Employee | null;
  address?: Address;
  status: DeliveryStatusEnum;
  businessStatus: BusinessStatusEnum;
  driverStatus: DriverStatusEnum | null;
}

export interface Product {
  id: number;
  name: string;
  quantity: number;
  measure: number;
  brand: string;
  price: number;
  enabled: boolean;
  purchases?: PurchaseProduct[];
  sales?: ProductSale[];
}

export interface ProductSale {
  saleId: number;
  productId: number;
  quantity: number;
  sale?: Sale;
  product?: Product;
}

export interface Sale {
  id: number;
  customerId: number;
  employeeId: number;
  startDate: Date;
  lastUpdateDate: Date;
  customer?: Customer;
  employee?: Employee;
  status: SaleStatusEnum;
  products?: ProductSale[];
  deliveries?: Delivery[];
}

export interface Entity {
  id: number;
  name: string;
  type: EntityType;
  users?: User[];
  permissions?: Entity[];
  roles?: Entity[];
}

export interface User {
  id: number;
  email: string;
  password: string;
  enabled: boolean;
  verified: boolean;
  sessions?: Session[];
  permissions?: Entity[];
  signatures?: Signature[];
  audits?: Audit[];
  employee?: Employee | null;
  employeeId: number | null;
}

export interface Session {
  id: string;
  ip: string;
  userAgent: string;
  active: boolean;
  createdAt: Date;
  expiresAt: Date;
  user?: User | null;
  userId: number | null;
}

export interface Signature {
  id: string;
  action: AccountAction;
  userAgent: string | null;
  ip: string | null;
  createdAt: Date;
  expiresAt: Date;
  user?: User;
  userId: number;
}

export interface Audit {
  id: number;
  timestamp: Date;
  action: AuditAction;
  entityType: string;
  userId: number;
  user?: User;
  data: JsonValue | null;
  description: string | null;
}

type JsonValue = string | number | boolean | { [key in string]?: JsonValue } | Array<JsonValue> | null;
