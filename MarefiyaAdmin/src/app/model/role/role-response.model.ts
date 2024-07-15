import { Role } from './role.model';

export class RoleResponse {
  page!: number;
  pages!: number;
  pageSize!: number;
  rows!: number;
  data?: Role[];
}
