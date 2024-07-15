import { Vehicle } from './vehicle.model';

export class VehiclesResponse {
  page!: number;
  pages!: number;
  pageSize!: number;
  rows!: number;
  data?: Vehicle[];

  constructor(page: number, pages: number, pageSize: number, rows: number) {
    this.page = page;
    this.pages = pages;
    this.pageSize = pageSize;
    this.rows = rows;
  }
}
