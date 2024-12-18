import { ApiService } from "@/services/api-service";
import { ApiResponse } from "@/types/api/api";
import {
  FetchDeliveriesResponse,
  FetchSharedDeliveriesResponse,
} from "@/types/api/responses/deliveries";

export class DeliveriesService extends ApiService {
  static async fetchDeliveries(
    token: string
  ): Promise<ApiResponse<FetchDeliveriesResponse>> {
    return this.fetch<ApiResponse<FetchDeliveriesResponse>>(
      "/deliveries",
      {},
      token
    );
  }

  static async fetchSharedDeliveries(): Promise<
    ApiResponse<FetchSharedDeliveriesResponse>
  > {
    return this.fetch<ApiResponse<FetchSharedDeliveriesResponse>>(
      "/shared/deliveries"
    );
  }
}
