import { SaleStatusEnum } from "@/types/api/interfaces";

export const SALE_STATUS: Record<SaleStatusEnum, string> = {
  CREATED: "Creado",
  IN_PROGRESS: "En Progreso",
  IN_DELIVERY: "En Entrega",
  PREPARING: "Preparando",
  READY: "Listo",
  CANCELLED: "Cancelado",
  DELIVERED: "Entregado",
};
