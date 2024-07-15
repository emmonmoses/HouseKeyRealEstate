import { Injectable } from '@angular/core';
import { Observable, Subscription, catchError, map, tap } from 'rxjs';
import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { CompanyResponse } from 'src/app/model/company/company-response.model';
import { Company } from 'src/app/model/company/company.model';
import { DeleteModel } from 'src/app/model/delete-message.model';
import { RoleResponse } from 'src/app/model/role/role-response.model';
import { ProtectedService } from 'src/app/protected.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { BaseService } from 'src/app/shared/base.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService extends BaseService {
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

  getRoles(page: number, pageSize: number): Observable<any> {
    return this.http
      .get(
        `${this.resEndpoint.GetRoleUri}?page=${page}&pageSize=${pageSize}`,
        this.httpOptions
      )
      .pipe(
        tap((response: RoleResponse) => {}),
        map((response: RoleResponse) => response),
        catchError(this.handleError)
      );
  }
}
