import { TripType } from './trip-type.model';

export class TripTypeResponse {
  page!: number;
  pages!: number;
  pageSize!: number;
  rows!: number;
  data?: TripType[];

  constructor(page: number, pages: number, pageSize: number, rows: number) {
    this.page = page;
    this.pages = pages;
    this.pageSize = pageSize;
    this.rows = rows;
  }
}
