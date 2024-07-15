import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { LogInResponse } from 'src/app/model/LogIn/LogIn-response.model';
import { LogIn } from 'src/app/model/LogIn/LogIn.model';
import { ProtectedService } from 'src/app/protected.service';
import { HttpService } from 'src/app/services/http.service';
import { BaseService } from 'src/app/shared/base.service';

@Injectable({
  providedIn: 'root',
})
export class LogInService extends BaseService {
  httpOptions: any;
  token: any;
  subscription: Subscription | any;
  constructor(
    private resEndpoint: ResourceEndpointService,
    private http: HttpService,
    private protectedService: ProtectedService
  ) {
    super();
    this.httpOptions = this.protectedService.getHttpOptions(this.token);
  }

  LogIn(LogIn: LogIn): Observable<LogInResponse> {
    return this.http.post(this.resEndpoint.LogInUri, LogIn).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }
}
