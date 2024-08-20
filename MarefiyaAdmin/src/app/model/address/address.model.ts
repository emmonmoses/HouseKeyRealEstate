export class Address {
    city!: string;
    kebele?: string;
    subCity?: string;
    houseNumber?: string;
  
    constructor(city: string, kebele?: string, subCity?: string, houseNumber?: string) {
      this.city = city;
      this.kebele = kebele;
      this.subCity = subCity;
      this.houseNumber = houseNumber;
    }
  }
  