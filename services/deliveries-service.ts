import { ApiService } from "@/services/api-service";
import { Delivery } from "@/types/api/interfaces";
import {
  CreateDeliveryResponse,
  DeleteDeliveryResponse,
  FetchDeliveriesResponse,
  FetchSharedDeliveriesResponse,
  UpdateDeliveryResponse,
} from "@/types/api/responses/deliveries";

export class DeliveriesService extends ApiService {
  static async fetchDeliveries(): Promise<
    ApiResponse<FetchDeliveriesResponse>
  > {
    return this.fetch<ApiResponse<FetchDeliveriesResponse>>("/deliveries");
  }

  static async fetchSharedDeliveries(): Promise<
    ApiResponse<FetchSharedDeliveriesResponse>
  > {
    return this.fetch<ApiResponse<FetchSharedDeliveriesResponse>>(
      "/shared/deliveries"
    );
  }
}
