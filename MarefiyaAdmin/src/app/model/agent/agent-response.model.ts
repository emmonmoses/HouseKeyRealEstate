import { Agent } from './agent.model';

export class AgentResponse {
  page!: number;
  pages!: number;
  pageSize!: number;
  rows!: number;
  data?: Agent[];

  constructor(page: number, pages: number, pageSize: number, rows: number) {
    this.page = page;
    this.pages = pages;
    this.pageSize = pageSize;
    this.rows = rows;
  }
}
