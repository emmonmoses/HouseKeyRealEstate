import { Injectable } from '@angular/core';
import { Observable, Subscription, catchError, map } from 'rxjs';
import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { DeleteModel } from 'src/app/model/delete-message.model';
import { FeeTypeResponse } from 'src/app/model/fee-type/fee-type-response.model';
import { FeeType } from 'src/app/model/fee-type/fee-type.model';
import { ProtectedService } from 'src/app/protected.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { BaseService } from 'src/app/shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class FeeTypeService extends BaseService {
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

  getAll(): Observable<FeeTypeResponse> {
    return this.http
      .get(`${this.resEndpoint.GetFeeTypeUri}`, this.httpOptions)
      .pipe(
        map((response: FeeTypeResponse) => response),
        catchError(this.handleError)
      );
  };

  create(feeType: FeeType): Observable<FeeType> {
    return this.http
      .post(this.resEndpoint.GetFeeTypeUri, feeType, this.httpOptions)
      .pipe(
        map((response: FeeType) => response),
        catchError(this.handleError)
      );
  };

  update(feeType: FeeType): Observable<FeeType> {
    return this.http
      .patch(`${this.resEndpoint.GetFeeTypeUri}`, feeType, this.httpOptions)
      .pipe(
        map((response: FeeType) => response),
        catchError(this.handleError)
      );
  };

  delete(feeTypeId: string, adminCode: string): Observable<DeleteModel> {
    return this.http
      .delete(
        `${this.resEndpoint.GetFeeTypeUri}/${feeTypeId}/${adminCode}`,
        this.httpOptions
      )
      .pipe(
        map((response: DeleteModel) => response),
        catchError(this.handleError)
      );
  }
}
