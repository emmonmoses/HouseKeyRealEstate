import { Injectable } from '@angular/core';
import { Observable, Subscription, catchError, map } from 'rxjs';
import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { CompanyCreate } from 'src/app/model/company/company-create.model';
import { CompanyResponse } from 'src/app/model/company/company-response.model';
import { Company } from 'src/app/model/company/company.model';
import { DeleteModel } from 'src/app/model/delete-message.model';
import { ProtectedService } from 'src/app/protected.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { BaseService } from 'src/app/shared/base.service';

@Injectable({
  providedIn: 'root',
})
export class CompanyService extends BaseService {
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

  createCompany(company: CompanyCreate): Observable<Company> {
    return this.http
      .post(this.resEndpoint.GetCompanyUri, company, this.httpOptions)
      .pipe(
        map((response: Company) => response),
        catchError(this.handleError)
      );
  }

  getAllCompany(): Observable<CompanyResponse> {
    return this.http
      .get(`${this.resEndpoint.GetCompanyUri}`, this.httpOptions)
      .pipe(
        map((response: CompanyResponse) => response),
        catchError(this.handleError)
      );
  }

  getCompanyById(companyId: string): Observable<Company> {
    var url =
      this.resEndpoint.GetCompanyUri + '/' + companyId.replace(/["']/g, '');
    return this.http.get(url, this.httpOptions).pipe(
      map((response: Company) => response),
      catchError(this.handleError)
    );
  }

  deleteCompany(companyId: string, adminCode: string): Observable<DeleteModel> {
    return this.http
      .delete(
        `${this.resEndpoint.GetCompanyUri}/${companyId}/${adminCode}`,
        this.httpOptions
      )
      .pipe(
        map((response: DeleteModel) => response),
        catchError(this.handleError)
      );
  }

  updateCompany(company: Company): Observable<Company> {
    return this.http
      .patch(`${this.resEndpoint.GetCompanyUri}`, company, this.httpOptions)
      .pipe(
        map((response: Company) => response),
        catchError(this.handleError)
      );
  }
}
