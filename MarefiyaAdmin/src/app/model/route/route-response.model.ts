import { Route } from './route.model';

export class RouteResponse {
  page!: number;
  pages!: number;
  pageSize!: number;
  rows!: number;
  data?: Route[];

  constructor(page: number, pages: number, pageSize: number, rows: number) {
    this.page = page;
    this.pages = pages;
    this.pageSize = pageSize;
    this.rows = rows;
  }
}
