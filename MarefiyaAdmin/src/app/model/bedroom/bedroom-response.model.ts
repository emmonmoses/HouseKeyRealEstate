import { BedRoom } from './bedroom.model';

export class BedroomResponse {
    page!: number;
    pages!: number;
    pageSize!: number;
    rows!: number;
    data?: BedRoom[];

    constructor(page: number, pages: number, pageSize: number, rows: number) {
        this.page = page;
        this.pages = pages;
        this.pageSize = pageSize;
        this.rows = rows;
    }
}
