import { Injectable } from '@angular/core';
import { catchError, map, Observable, Subscription } from 'rxjs';
import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { BedroomResponse } from 'src/app/model/bedroom/bedroom-response.model';
import { BedRoom } from 'src/app/model/bedroom/bedroom.model';
import { DeleteModel } from 'src/app/model/delete-message.model';
import { ProtectedService } from 'src/app/protected.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { BaseService } from 'src/app/shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class BedroomService extends BaseService {
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

  getAll(): Observable<BedroomResponse> {
    return this.http
      .get(`${this.resEndpoint.GetBedroomUri}`, this.httpOptions)
      .pipe(
        map((response: BedroomResponse) => response),
        catchError(this.handleError)
      );
  };

  create(bedroom: BedRoom): Observable<BedRoom> {
    return this.http
      .post(this.resEndpoint.GetBedroomUri, bedroom, this.httpOptions)
      .pipe(
        map((response: BedRoom) => response),
        catchError(this.handleError)
      );
  };

  update(bedroom: BedRoom): Observable<BedRoom> {
    return this.http
      .patch(`${this.resEndpoint.GetBedroomUri}`, bedroom, this.httpOptions)
      .pipe(
        map((response: BedRoom) => response),
        catchError(this.handleError)
      );
  };

  delete(bedroomId: string, adminCode: string): Observable<DeleteModel> {
    return this.http
      .delete(
        `${this.resEndpoint.GetBedroomUri}/${bedroomId}/${adminCode}`,
        this.httpOptions
      )
      .pipe(
        map((response: DeleteModel) => response),
        catchError(this.handleError)
      );
  }
}
