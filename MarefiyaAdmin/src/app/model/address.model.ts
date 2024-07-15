export class Address {
  city!: string;
  country!: string;
  region!: string;

  constructor(city: string, country: string, region: string) {
    this.city = city;
    this.country = country;
    this.region = region;
  }
}
