import { Injectable } from '@angular/core';
import { catchError, map, Observable, Subscription } from 'rxjs';
import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { CustomerResponse } from 'src/app/model/customer/customer-response.model';
import { Customer } from 'src/app/model/customer/customer.model';
import { DeleteModel } from 'src/app/model/delete-message.model';
import { ProtectedService } from 'src/app/protected.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { BaseService } from 'src/app/shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseService {
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

  getAll(): Observable<CustomerResponse> {
    return this.http
      .get(`${this.resEndpoint.GetCustomerUri}`, this.httpOptions)
      .pipe(
        map((response: CustomerResponse) => response),
        catchError(this.handleError)
      );
  };

  create(customer: Customer): Observable<Customer> {
    return this.http
      .post(this.resEndpoint.GetCustomerUri, customer, this.httpOptions)
      .pipe(
        map((response: Customer) => response),
        catchError(this.handleError)
      );
  };

  update(customer: Customer): Observable<Customer> {
    return this.http
      .patch(`${this.resEndpoint.GetCustomerUri}`, customer, this.httpOptions)
      .pipe(
        map((response: Customer) => response),
        catchError(this.handleError)
      );
  };

  delete(customerId: string, adminCode: string): Observable<DeleteModel> {
    return this.http
      .delete(
        `${this.resEndpoint.GetCustomerUri}/${customerId}/${adminCode}`,
        this.httpOptions
      )
      .pipe(
        map((response: DeleteModel) => response),
        catchError(this.handleError)
      );
  }
}
