export class Address {
  city!: string;
  country!: string;
  region!: string;
  kebele?: string;
  subCity?: string;
  houseNumber?: string;

  constructor(city: string, country: string, region: string, kebele?: string, subCity?: string, houseNumber?: string) {
    this.city = city;
    this.country = country;
    this.region = region;
    this.kebele = kebele;
    this.subCity = subCity;
    this.houseNumber = houseNumber;
  }
}
