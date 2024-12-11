import { DeliveryStatusEnum } from "@/types/api/interfaces";

export const DELIVERY_STATUS: Record<DeliveryStatusEnum, string> = {
  ASSIGNED: "Asignado",
  CREATED: "Creado",
  IN_PROGRESS: "En Progreso",
  IN_TRANSIT: "En Tránsito",
  CANCELLED: "Cancelado",
  CONFLICT: "Conflicto",
  FINISHED: "Finalizado",
};
