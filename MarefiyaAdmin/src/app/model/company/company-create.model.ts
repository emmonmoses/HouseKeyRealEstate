import { Phone } from '../phone.model';
import { Address } from '../address.model';

export class CompanyCreate {
  name!: string;
  email!: string;
  password!: string;
  phone!: Phone;
  address!: Address;
  roleId!: string;
}
