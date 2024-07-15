import { Injectable } from '@angular/core';
import { Observable, Subscription, catchError, map } from 'rxjs';
import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { DeleteModel } from 'src/app/model/delete-message.model';
import { LocationCreate } from 'src/app/model/locations/location-create.model';
import { TimingCreate } from 'src/app/model/timing/timing-create.model';
import { TimingResponse } from 'src/app/model/timing/timing-response.model';
import { Timing } from 'src/app/model/timing/timing.model';
import { ProtectedService } from 'src/app/protected.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { BaseService } from 'src/app/shared/base.service';

@Injectable({
  providedIn: 'root',
})
export class TimingService extends BaseService {
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

  getAllTiming(page: number, pageSize: number): Observable<TimingResponse> {
    return this.http
      .get(
        `${this.resEndpoint.GetTimingUri}?page=${page}&pageSize=${pageSize}`,
        this.httpOptions
      )
      .pipe(
        map((response: TimingResponse) => response),
        catchError(this.handleError)
      );
  }

  createTiming(timing: TimingCreate): Observable<Timing> {
    return this.http
      .post(this.resEndpoint.GetTimingUri, timing, this.httpOptions)
      .pipe(
        map((response: Timing) => response),
        catchError(this.handleError)
      );
  }

  updateTiming(timing: Timing): Observable<Timing> {
    return this.http
      .patch(`${this.resEndpoint.GetTimingUri}`, timing, this.httpOptions)
      .pipe(
        map((response: Timing) => response),
        catchError(this.handleError)
      );
  }

  deleteTiming(timingId: string, adminCode: string): Observable<DeleteModel> {
    return this.http
      .delete(
        `${this.resEndpoint.GetTimingUri}/${timingId}/${adminCode}`,
        this.httpOptions
      )
      .pipe(
        map((response: DeleteModel) => response),
        catchError(this.handleError)
      );
  }
}
