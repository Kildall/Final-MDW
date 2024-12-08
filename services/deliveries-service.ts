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
    console.log("fetching shared deliveries");
    return this.fetch<ApiResponse<FetchSharedDeliveriesResponse>>(
      "/shared/deliveries"
    );
  }

  static async createDelivery(
    delivery: Omit<Delivery, "id" | "_count">
  ): Promise<ApiResponse<CreateDeliveryResponse>> {
    return this.fetch<ApiResponse<CreateDeliveryResponse>>("/deliveries", {
      method: "POST",
      body: JSON.stringify(delivery),
    });
  }

  static async updateDelivery(
    id: number,
    updates: Partial<Delivery>
  ): Promise<ApiResponse<UpdateDeliveryResponse>> {
    return this.fetch<ApiResponse<UpdateDeliveryResponse>>(
      `/deliveries/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(updates),
      }
    );
  }

  static async deleteDelivery(
    id: number
  ): Promise<ApiResponse<DeleteDeliveryResponse>> {
    return this.fetch<ApiResponse<DeleteDeliveryResponse>>(
      `/deliveries/${id}`,
      {
        method: "DELETE",
      }
    );
  }
}
