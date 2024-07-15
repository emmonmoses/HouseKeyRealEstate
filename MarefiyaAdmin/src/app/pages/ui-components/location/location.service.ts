import { Injectable } from '@angular/core';
import { Observable, Subscription, catchError, map } from 'rxjs';
import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { DeleteModel } from 'src/app/model/delete-message.model';
import { LocationCreate } from 'src/app/model/locations/location-create.model';
import { LocationResponse } from 'src/app/model/locations/location-response.model';
import { ProtectedService } from 'src/app/protected.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { BaseService } from 'src/app/shared/base.service';
import { Locations } from 'src/app/model/locations/location.model';

@Injectable({
  providedIn: 'root',
})
export class LocationService extends BaseService {
  httpOptions: any;
  token: any;
  subscription: Subscription | any;

  constructor(
    private resEndpoint: ResourceEndpointService,
    private http: HttpService,
    private protectedService: ProtectedService,
    private authService: AuthService
  ) {
    super();
    this.token = this.authService.getToken;
    this.httpOptions = this.protectedService.getHttpOptions(this.token);
  }

  getAllLocation(page: number, pageSize: number): Observable<LocationResponse> {
    return this.http
      .get(
        `${this.resEndpoint.GetLocationUri}?page=${page}&pageSize=${pageSize}`,
        this.httpOptions
      )
      .pipe(
        map((response: LocationResponse) => response),
        catchError(this.handleError)
      );
  }

  createLocation(tripType: LocationCreate): Observable<Locations> {
    return this.http
      .post(this.resEndpoint.GetLocationUri, tripType, this.httpOptions)
      .pipe(
        map((response: Locations) => response),
        catchError(this.handleError)
      );
  }

  updateLocation(location: Locations): Observable<Locations> {
    return this.http
      .patch(`${this.resEndpoint.GetLocationUri}`, location, this.httpOptions)
      .pipe(
        map((response: Locations) => response),
        catchError(this.handleError)
      );
  }

  deleteLocation(
    locationId: string,
    adminCode: string
  ): Observable<DeleteModel> {
    return this.http
      .delete(
        `${this.resEndpoint.GetLocationUri}/${locationId}/${adminCode}`,
        this.httpOptions
      )
      .pipe(
        map((response: DeleteModel) => response),
        catchError(this.handleError)
      );
  }
}
