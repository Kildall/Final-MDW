import { Delivery } from "../interfaces";

export interface FetchDeliveriesResponse {
  deliveries: Delivery[];
}

export interface FetchSharedDeliveriesResponse
  extends FetchDeliveriesResponse {}

export interface CreateDeliveryResponse extends Delivery {}

export interface UpdateDeliveryResponse extends Delivery {}

export interface DeleteDeliveryResponse {}
