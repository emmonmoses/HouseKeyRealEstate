import { Injectable } from '@angular/core';
import { Observable, Subscription, catchError, map } from 'rxjs';
import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { VehicleCreate } from 'src/app/model/Vehicles/vehicle-create.model';
import { VehiclesResponse } from 'src/app/model/Vehicles/vehicle-response.model';
import { Vehicle } from 'src/app/model/Vehicles/vehicle.model';
import { DeleteModel } from 'src/app/model/delete-message.model';
import { TripTypeCreate } from 'src/app/model/trip-type/trip-type-create.mode';
import { TripTypeResponse } from 'src/app/model/trip-type/trip-type-response.model';
import { TripType } from 'src/app/model/trip-type/trip-type.model';
import { ProtectedService } from 'src/app/protected.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { BaseService } from 'src/app/shared/base.service';

@Injectable({
  providedIn: 'root',
})
export class TripTypeService extends BaseService {
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

  getAllTripType(page: number, pageSize: number): Observable<TripTypeResponse> {
    return this.http
      .get(
        `${this.resEndpoint.GetTripTypeUri}?page=${page}&pageSize=${pageSize}`,
        this.httpOptions
      )
      .pipe(
        map((response: TripTypeResponse) => response),
        catchError(this.handleError)
      );
  }

  createTripType(tripType: TripTypeCreate): Observable<TripType> {
    return this.http
      .post(this.resEndpoint.GetTripTypeUri, tripType, this.httpOptions)
      .pipe(
        map((response: TripType) => response),
        catchError(this.handleError)
      );
  }

  updateTripType(tripType: TripType): Observable<TripType> {
    return this.http
      .patch(`${this.resEndpoint.GetTripTypeUri}`, tripType, this.httpOptions)
      .pipe(
        map((response: TripType) => response),
        catchError(this.handleError)
      );
  }

  deleteTripType(
    tripTypeId: string,
    adminCode: string
  ): Observable<DeleteModel> {
    return this.http
      .delete(
        `${this.resEndpoint.GetTripTypeUri}/${tripTypeId}/${adminCode}`,
        this.httpOptions
      )
      .pipe(
        map((response: DeleteModel) => response),
        catchError(this.handleError)
      );
  }
}
