import { Address } from "../address/address.model";
import { Phone } from "../phone.model";

export class Customer {
    id?: string;
    phone?: Phone;
    address?: Address;
    code?: string;
    firstname!: string;
    fathername!: string;
    grandfathername!: string;
    age?: number;
    gender?: string;
    email?: string;
    status?: boolean;
    role?: string;
    createdAt?: string;
    password?: string;
    roleId?: string;
}