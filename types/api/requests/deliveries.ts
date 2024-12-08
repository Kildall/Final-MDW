import { Delivery } from "../interfaces";

export interface CreateDeliveryRequest {
  delivery: Omit<Delivery, "id" | "_count">;
}
