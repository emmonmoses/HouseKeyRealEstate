import { Injectable } from '@angular/core';
import { Observable, Subscription, catchError, map } from 'rxjs';
import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { DeleteModel } from 'src/app/model/delete-message.model';
import { DriverCreate } from 'src/app/model/driver/driver-create.model';
import { DriverResponse } from 'src/app/model/driver/driver-response.model';
import { Driver } from 'src/app/model/driver/driver.model';
import { ProtectedService } from 'src/app/protected.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { BaseService } from 'src/app/shared/base.service';

@Injectable({
  providedIn: 'root',
})
export class DriversService extends BaseService {
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

  getAllDrivers(page: number, pageSize: number): Observable<DriverResponse> {
    return this.http
      .get(
        `${this.resEndpoint.GetDriverUri}?page=${page}&pageSize=${pageSize}`,
        this.httpOptions
      )
      .pipe(
        map((response: DriverResponse) => response),
        catchError(this.handleError)
      );
  }

  createDriver(driver: DriverCreate): Observable<Driver> {
    return this.http
      .post(this.resEndpoint.GetDriverUri, driver, this.httpOptions)
      .pipe(
        map((response: Driver) => response),
        catchError(this.handleError)
      );
  }

  deleteDriver(driverId: string, adminCode: string): Observable<DeleteModel> {
    return this.http
      .delete(
        `${this.resEndpoint.GetDriverUri}/${driverId}/${adminCode}`,
        this.httpOptions
      )
      .pipe(
        map((response: DeleteModel) => response),
        catchError(this.handleError)
      );
  }

  uploadAvatars(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.http.post(
      `${this.resEndpoint.GetDriverUri}/uploadDriverAvatar`,
      formData,
      this.httpOptions
    );
  }

  uploadAvatar(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.http
      .post(
        `${this.resEndpoint.GetDriverUri}/uploadDriverAvatar`,
        formData,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  uploadFrontCarImage(file: File): Observable<{ avatar: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.http.post(
      `${this.resEndpoint.GetDriverUri}/uploadVehicleFront`,
      formData,
      this.httpOptions
    ) as Observable<{ avatar: string }>;
  }

  uploadBackCarImage(file: File): Observable<{ avatar: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.http.post(
      `${this.resEndpoint.GetDriverUri}/uploadVehicleBack`,
      formData,
      this.httpOptions
    ) as Observable<{ avatar: string }>;
  }

  uploadVehicleLogBookImage(file: File): Observable<{ avatar: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.http.post(
      `${this.resEndpoint.GetDriverUri}/uploadVehicleLogBook`,
      formData,
      this.httpOptions
    ) as Observable<{ avatar: string }>;
  }

  uploadDrivingLicenseImg(file: File): Observable<{ avatar: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.http.post(
      `${this.resEndpoint.GetDriverUri}/uploadDrivingLicense`,
      formData,
      this.httpOptions
    ) as Observable<{ avatar: string }>;
  }

  uploadBusinessLicenseImg(file: File): Observable<{ avatar: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.http.post(
      `${this.resEndpoint.GetDriverUri}/uploadBusinessLicense`,
      formData,
      this.httpOptions
    ) as Observable<{ avatar: string }>;
  }
}
