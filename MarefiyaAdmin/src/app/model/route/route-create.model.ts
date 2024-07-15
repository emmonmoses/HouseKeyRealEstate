export class CreateRoute {
  name!: string;
  status?: number;
  pickupLocationId!: string;
  dropLocationId!: string;
  vehicleTypeId!: string;
  price!: number;
  actionBy?: string;
}
