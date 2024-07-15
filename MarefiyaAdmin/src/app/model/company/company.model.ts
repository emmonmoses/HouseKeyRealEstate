import { Phone } from '../phone.model';
import { Address } from '../address.model';
import { Role } from '../role/role.model';

export class Company {
  id?: string;
  phone?: Phone;
  address?: Address;
  code!: string;
  name!: string;
  email!: string;
  status?: number;
  createdAt?: string;
  updatedAt?: string;
  role!: Role;
  permissions!: Permissions[];
  password?: string;
}
