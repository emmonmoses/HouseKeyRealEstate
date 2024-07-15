import { Locations } from './location.model';

export class LocationResponse {
  page!: number;
  pages!: number;
  pageSize!: number;
  rows!: number;
  data?: Locations[];

  constructor(page: number, pages: number, pageSize: number, rows: number) {
    this.page = page;
    this.pages = pages;
    this.pageSize = pageSize;
    this.rows = rows;
  }
}
