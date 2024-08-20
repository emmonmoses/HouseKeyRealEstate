import { Customer } from './customer.model';

export class CustomerResponse {
    page!: number;
    pages!: number;
    pageSize!: number;
    rows!: number;
    data?: Customer[];

    constructor(page: number, pages: number, pageSize: number, rows: number) {
        this.page = page;
        this.pages = pages;
        this.pageSize = pageSize;
        this.rows = rows;
    }
}
