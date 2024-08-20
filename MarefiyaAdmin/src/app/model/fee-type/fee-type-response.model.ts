import { FeeType } from './fee-type.model';

export class FeeTypeResponse {
    page!: number;
    pages!: number;
    pageSize!: number;
    rows!: number;
    data?: FeeType[];

    constructor(page: number, pages: number, pageSize: number, rows: number) {
        this.page = page;
        this.pages = pages;
        this.pageSize = pageSize;
        this.rows = rows;
    }
}
