import { Vehicle } from '../Vehicles/vehicle.model';
import { DropLocation } from '../dropLocation.model';
import { PickupLocation } from '../pickupLocation.model';

export class Route {
  id!: string;
  name!: string;
  status!: number;
  price!: number;
  createdAt!: string;
  updatedAt!: string;
  pickupLocation!: PickupLocation;
  dropLocation!: DropLocation;
  vehicle!: Vehicle;
}
