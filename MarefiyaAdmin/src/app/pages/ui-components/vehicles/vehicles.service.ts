import { Injectable } from '@angular/core';
import { Observable, Subscription, catchError, map } from 'rxjs';
import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { VehicleCreate } from 'src/app/model/Vehicles/vehicle-create.model';
import { VehiclesResponse } from 'src/app/model/Vehicles/vehicle-response.model';
import { Vehicle } from 'src/app/model/Vehicles/vehicle.model';
import { DeleteModel } from 'src/app/model/delete-message.model';
import { ProtectedService } from 'src/app/protected.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { BaseService } from 'src/app/shared/base.service';

@Injectable({
  providedIn: 'root',
})
export class VehiclesService extends BaseService {
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

  getAllVehicles(page: number, pageSize: number): Observable<VehiclesResponse> {
    return this.http
      .get(
        `${this.resEndpoint.GetVehiclesUri}?page=${page}&pageSize=${pageSize}`,
        this.httpOptions
      )
      .pipe(
        map((response: VehiclesResponse) => response),
        catchError(this.handleError)
      );
  }

  createVehicle(vehicle: VehicleCreate): Observable<Vehicle> {
    return this.http
      .post(this.resEndpoint.GetVehiclesUri, vehicle, this.httpOptions)
      .pipe(
        map((response: Vehicle) => response),
        catchError(this.handleError)
      );
  }

  updateVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http
      .patch(`${this.resEndpoint.GetVehiclesUri}`, vehicle, this.httpOptions)
      .pipe(
        map((response: Vehicle) => response),
        catchError(this.handleError)
      );
  }

  deleteVehicle(vehicleId: string, adminCode: string): Observable<DeleteModel> {
    return this.http
      .delete(
        `${this.resEndpoint.GetVehiclesUri}/${vehicleId}/${adminCode}`,
        this.httpOptions
      )
      .pipe(
        map((response: DeleteModel) => response),
        catchError(this.handleError)
      );
  }
}
