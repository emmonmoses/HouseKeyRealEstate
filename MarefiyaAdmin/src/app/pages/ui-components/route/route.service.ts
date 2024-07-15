import { Injectable } from '@angular/core';
import { Observable, Subscription, catchError, map } from 'rxjs';
import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { DeleteModel } from 'src/app/model/delete-message.model';
import { CreateRoute } from 'src/app/model/route/route-create.model';
import { RouteResponse } from 'src/app/model/route/route-response.model';
import { UpdateRoute } from 'src/app/model/route/route-update.model';
import { Route } from 'src/app/model/route/route.model';
import { ProtectedService } from 'src/app/protected.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { BaseService } from 'src/app/shared/base.service';

@Injectable({
  providedIn: 'root',
})
export class RouteService extends BaseService {
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

  getAllRoute(page: number, pageSize: number): Observable<RouteResponse> {
    return this.http
      .get(
        `${this.resEndpoint.GetRouteUri}?page=${page}&pageSize=${pageSize}`,
        this.httpOptions
      )
      .pipe(
        map((response: RouteResponse) => response),
        catchError(this.handleError)
      );
  }

  createRoute(route: CreateRoute): Observable<Route> {
    return this.http
      .post(this.resEndpoint.GetRouteUri, route, this.httpOptions)
      .pipe(
        map((response: Route) => response),
        catchError(this.handleError)
      );
  }

  updateRoute(route: UpdateRoute): Observable<Route> {
    return this.http
      .patch(`${this.resEndpoint.GetRouteUri}`, route, this.httpOptions)
      .pipe(
        map((response: Route) => response),
        catchError(this.handleError)
      );
  }

  deleteRoute(routeId: string, adminCode: string): Observable<DeleteModel> {
    return this.http
      .delete(
        `${this.resEndpoint.GetRouteUri}/${routeId}/${adminCode}`,
        this.httpOptions
      )
      .pipe(
        map((response: DeleteModel) => response),
        catchError(this.handleError)
      );
  }
}
