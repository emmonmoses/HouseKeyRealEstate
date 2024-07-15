import { Auth } from '../auth.model';

export class LogInResponse {
  LogInStatus!: number;
  id!: string;
  name!: string;
  admin!: string;
  // avatar!: string;
  username!: string;
  role!: string;
  permissions!: any[];
  authorization!: Auth;

  constructor() {
    this.authorization = new Auth();
  }
}
