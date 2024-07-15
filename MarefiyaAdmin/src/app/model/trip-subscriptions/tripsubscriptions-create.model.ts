export class CreateTripSubscription {
  description!: string;
  customers!: Customer[];
  routeId!: string;
  timingId!: string;
  vehicleId!: string;
  tripTypeId!: number;
  driverId!: number;
  actionBy?: string;
}

export class Customer {
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
