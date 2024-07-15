import { Address } from '../address.model';
import { Phone } from '../phone.model';

export class DriverCreate {
  avatar!: string;
  name!: string;
  email!: string;
  password!: string;
  phone!: Phone;
  address!: Address;
  vehicleBack!: string;
  vehicleFront!: string;
  vehicleLogBook!: string;
  drivingLicense!: string;
  plateNumber!: string;
  plateNumberCode!: string;
  businessLicense!: string;
  isAssigned!: Boolean;
  roleId!: string;
  vehicleId!: string;
  actionBy!: string;
  routeId!: string;
  timingId!: string;
  tripTypeId!: string;
}
