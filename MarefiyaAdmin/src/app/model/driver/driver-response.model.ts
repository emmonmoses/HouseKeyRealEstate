import { Driver } from './driver.model';

export class DriverResponse {
  page!: number;
  pages!: number;
  pageSize!: number;
  rows!: number;
  data?: Driver[];

  constructor(page: number, pages: number, pageSize: number, rows: number) {
    this.page = page;
    this.pages = pages;
    this.pageSize = pageSize;
    this.rows = rows;
  }
}
