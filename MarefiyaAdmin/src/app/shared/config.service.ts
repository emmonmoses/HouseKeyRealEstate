import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  //private readonly appHost: string;
  private readonly appApiHost: string;
  private readonly authHost: string;
  //public readonly clientId: string;

  constructor() {
    /**
     * load config from environments
     */
    //this.clientId = environment.clientId;
    //this.appHost = environment.appHost;
    this.authHost = environment.authHost;
    this.appApiHost = environment.appApiHost;
  }

  // get appAuthority() {
  //     return this.appHost;
  // }

  get authApiAuthority() {
    return this.authHost;
  }

  get authApiServiceURI() {
    return `${this.authHost}/api`;
  }

  get resourceApiServiceURI() {
    return `${this.appApiHost}/api`;
  }
}
