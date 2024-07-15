import { Timing } from './timing.model';

export class TimingResponse {
  page!: number;
  pages!: number;
  pageSize!: number;
  rows!: number;
  data?: Timing[];

  constructor(page: number, pages: number, pageSize: number, rows: number) {
    this.page = page;
    this.pages = pages;
    this.pageSize = pageSize;
    this.rows = rows;
  }
}
