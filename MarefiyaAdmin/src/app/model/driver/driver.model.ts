import { Address } from '../address.model';
import { Phone } from '../phone.model';

export class Driver {
  id!: string;
  phone!: Phone;
  address!: Address;
  drivingLicense!: string;
  vehicleFront!: string;
  vehicleBack!: string;
  vehicleLogBook!: string;
  plateNumber!: string;
  plateNumberCode!: string;
  businessLicense!: string;
  isAssigned!: Boolean;
  code!: string;
  name!: string;
  email!: string;
  status!: number;
  createdAt!: string;
  role!: string;
  route!: string;
  timing!: string;
  tripType!: string;
}
