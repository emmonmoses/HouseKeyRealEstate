import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Country } from '@angular-material-extensions/select-country';
import { DriversService } from '../drivers.service';
import { ToastService } from 'src/app/services/toast.service';
import { Vehicle } from 'src/app/model/Vehicles/vehicle.model';
import { VehiclesService } from '../../vehicles/vehicles.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { Role } from 'src/app/model/role/role.model';
import { RoleResponse } from 'src/app/model/role/role-response.model';
import { RoleService } from 'src/app/pages/authentication/role/role.service';
import { MessageService } from 'src/app/services/message.service';
import { RouteService } from '../../route/route.service';
import { Route } from 'src/app/model/route/route.model';
import { Timing } from 'src/app/model/timing/timing.model';
import { TimingService } from '../../timing/timing.service';
import { TripType } from 'src/app/model/trip-type/trip-type.model';
import { TripTypeService } from '../../trip-type/trip-type.service';
import { Phone } from 'src/app/model/phone.model';
import { Address } from 'src/app/model/address.model';
import { DriverCreate } from 'src/app/model/driver/driver-create.model';
import { StorageService } from 'src/app/services/storage.service';
import { KeyService } from 'src/app/services/key.service';

@Component({
  selector: 'app-create-driver',
  templateUrl: './create-driver.component.html',
  styleUrl: './create-driver.component.scss',
})
export class CreateDriverComponent implements OnInit {
  busy: boolean = false;
  pages: number[] = [];
  page = 1;
  pageSize = 10;
  country!: string;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fifthFormGroup: FormGroup;

  public avatar: any;
  avatarControl: FormControl;
  avatarName = '';
  vehicleBackControl: FormControl;
  vehicleBack = '';
  vehicleFrontControl: FormControl;
  vehicleFront = '';
  vehicleLogBook: FormControl;
  vehicleLog = '';
  drivingLicense: FormControl;
  drivingLicenseName = '';
  businessLicense: FormControl;
  businessLicenseName = '';
  selectedVehicleId?: string;
  selectedRoleId?: string;
  selectedRouteId?: string;
  selectedTimeId?: string;
  selectedTripId?: string;
  userType!: string;
  roles?: Role[];
  vehicles?: Vehicle[];
  routes?: Route[];
  timings?: Timing[];
  tripTypes?: TripType[];

  constructor(
    private _formBuilder: FormBuilder,
    private driversService: DriversService,
    private toastService: ToastService,
    private vehiclesService: VehiclesService,
    private roleService: RoleService,
    private messageService: MessageService,
    private routeService: RouteService,
    private timingService: TimingService,
    private tripTypeService: TripTypeService,
    private storageService: StorageService,
    private keyService: KeyService
  ) {
    this.firstFormGroup = this._formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      phone: ['', [Validators.required, Validators.maxLength(9)]],
    });
    this.secondFormGroup = this._formBuilder.group({
      city: ['', Validators.required],
      region: ['', Validators.required],
      country: ['', Validators.required],
    });
    this.thirdFormGroup = this._formBuilder.group({
      plateNumber: ['', Validators.required],
      plateNumberCode: ['', Validators.required],
      isAssigned: [false, Validators.required],
    });
    this.fifthFormGroup = this._formBuilder.group({
      roleId: ['', Validators.required],
      vehicleId: ['', Validators.required],
      routeId: ['', Validators.required],
      timingId: ['', Validators.required],
      tripTypeId: ['', Validators.required],
    });

    this.avatarControl = new FormControl('', Validators.required);
    this.vehicleBackControl = new FormControl('', Validators.required);
    this.vehicleFrontControl = new FormControl('', Validators.required);
    this.vehicleLogBook = new FormControl('', Validators.required);
    this.drivingLicense = new FormControl('', Validators.required);
    this.businessLicense = new FormControl('', Validators.required);

    this.fourthFormGroup = this._formBuilder.group({
      avatarControl: this.avatarControl,
      vehicleBackControl: this.vehicleBackControl,
      vehicleFrontControl: this.vehicleFrontControl,
      vehicleLogBook: this.vehicleFrontControl,
      drivingLicense: this.drivingLicense,
      businessLicense: this.businessLicense,
    });
  }

  ngOnInit(): void {
    this.busy = true;
    this.userType = this.storageService.getData(this.keyService.USER_TYPE);
    this.avatarControl.valueChanges.subscribe((file: File) => {
      this.avatar = file;
      this.avatarName = file.name;
    });
    this.vehicleBackControl.valueChanges.subscribe((file: File) => {
      this.avatar = file;
      this.vehicleBack = file.name;
    });
    this.vehicleFrontControl.valueChanges.subscribe((file: File) => {
      this.avatar = file;
      this.vehicleFront = file.name;
    });
    this.vehicleLogBook.valueChanges.subscribe((file: File) => {
      this.avatar = file;
      this.vehicleLog = file.name;
    });
    this.drivingLicense.valueChanges.subscribe((file: File) => {
      this.avatar = file;
      this.drivingLicenseName = file.name;
    });
    this.businessLicense.valueChanges.subscribe((file: File) => {
      this.avatar = file;
      this.businessLicenseName = file.name;
    });
    this.getAllVehicles();
    this.getAllRole();
    this.getAllRoutes();
    this.getAllTimings();
    this.getAllTripType();
    this.busy = false;
  }

  getAllTripType() {
    this.busy = true;
    return lastValueFrom(
      this.tripTypeService.getAllTripType(this.page, this.pageSize)
    )
      .then(
        (result) => {
          if (
            result?.data &&
            Array.isArray(result.data) &&
            result.data.length > 0
          ) {
            this.tripTypes = result.data;
            this.pages = Array.from(
              { length: result.pages },
              (_, index) => index + 1
            );
          } else {
            this.tripTypes = [];
            this.toastService.error('No Trip Types Found');
          }
        },
        (error) => {
          this.toastService.error('No Trip Types Found');
        }
      )
      .catch((error) => {
        console.error('Error fetching Trip Types:', error);
      })
      .finally(() => {
        this.busy = false;
      });
  }

  public getRole(): Promise<any> {
    return firstValueFrom(this.roleService.getRoles(this.page, this.pageSize));
  }

  getAllRoutes() {
    this.busy = true;
    return lastValueFrom(
      this.routeService.getAllRoute(this.page, this.pageSize)
    )
      .then(
        (result) => {
          if (
            result?.data &&
            Array.isArray(result.data) &&
            result.data.length > 0
          ) {
            this.routes = result.data;
            this.pages = Array.from(
              { length: result.pages },
              (_, index) => index + 1
            );
          } else {
            this.routes = [];
            this.toastService.error('No Routes Found');
          }
        },
        (error) => {
          this.toastService.error('No Routes Found');
        }
      )
      .catch((error) => {
        console.error('Error fetching Routes:', error);
      })
      .finally(() => {
        this.busy = false;
      });
  }

  getAllRole(): void {
    this.busy = true;
    this.getRole()
      .then(
        (result: RoleResponse) => {
          if (!result.data || result.data.length === 0) {
            this.toastService.error('No Roles Found');
          } else {
            this.roles = result.data;
            this.pages = Array.from(
              { length: result.pages },
              (_, index) => index + 1
            );
          }
        },
        (error) => {
          this.toastService.error(this.messageService.serverError);
        }
      )
      .finally(() => {
        this.busy = false;
      });
  }

  getAllVehicles() {
    this.busy = true;
    return lastValueFrom(
      this.vehiclesService.getAllVehicles(this.page, this.pageSize)
    )
      .then(
        (result) => {
          if (
            result?.data &&
            Array.isArray(result.data) &&
            result.data.length > 0
          ) {
            this.vehicles = result.data;
            this.pages = Array.from(
              { length: result.pages },
              (_, index) => index + 1
            );
          } else {
            this.vehicles = [];
            this.toastService.error('No Vehicles Found');
          }
        },
        (error) => {
          this.toastService.error('No Vehicles Found');
        }
      )
      .catch((error) => {
        console.error('Error fetching Vehicles:', error);
      })
      .finally(() => {
        this.busy = false;
      });
  }

  getAllTimings() {
    this.busy = true;
    return lastValueFrom(
      this.timingService.getAllTiming(this.page, this.pageSize)
    )
      .then(
        (result) => {
          if (
            result?.data &&
            Array.isArray(result.data) &&
            result.data.length > 0
          ) {
            this.timings = result.data;
            this.pages = Array.from(
              { length: result.pages },
              (_, index) => index + 1
            );
          } else {
            this.timings = [];
            this.toastService.error('No Timings Found');
          }
        },
        (error) => {
          this.toastService.error('No Timings Found');
        }
      )
      .catch((error) => {
        console.error('Error fetching Timings:', error);
      })
      .finally(() => {
        this.busy = false;
      });
  }

  onTripChange(event: any) {
    const role = event.value;
    this.selectedTripId = role;
  }

  onVehicleChange(event: any) {
    const role = event.value;
    this.selectedVehicleId = role;
  }

  onRouteChange(event: any) {
    const role = event.value;
    this.selectedRouteId = role;
  }

  onTimingChange(event: any) {
    const role = event.value;
    this.selectedTimeId = role;
  }

  onRoleChange(event: any) {
    const role = event.value;
    this.selectedRoleId = role;
  }

  onCountrySelected(event: Country) {
    this.country = event.name!;
  }

  maxDigitsValidator(maxDigits: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value === null || control.value === '') {
        return null; // Allow empty values
      }

      const value = control.value.toString(); // Convert to string to count digits
      const digits = value.replace(/[^0-9]/g, '').length; // Count digits

      if (digits > maxDigits) {
        return { maxDigits: { actual: digits, required: maxDigits } }; // Return error if exceeded
      }

      return null; // Validation passed
    };
  }

  uploadAvatar(file: File): void {
    this.driversService.uploadAvatar(file).subscribe(
      (uploadResponse: { name: string }) => {
        this.avatarName = uploadResponse.name;
        this.toastService.success('Driver Photo Uploaded Successfully');
      },
      (error: any) => {
        console.error('Error uploading file:', error);
      }
    );
  }

  uploadVehicleFront(file: File): void {
    this.driversService.uploadFrontCarImage(file).subscribe(
      (uploadResponse: { avatar: string }) => {
        this.vehicleFront = uploadResponse.avatar;
        this.toastService.success('Vehicle Front Image Uploaded Successfully');
      },
      (error: any) => {
        console.error('Error uploading file:', error);
      }
    );
  }

  uploadVehicleBack(file: File): void {
    this.driversService.uploadBackCarImage(file).subscribe(
      (uploadResponse: { avatar: string }) => {
        this.vehicleBack = uploadResponse.avatar;
        this.toastService.success('Vehicle Back Image Uploaded Successfully');
      },
      (error: any) => {
        console.error('Error uploading file:', error);
      }
    );
  }

  uploadVehicleLogBook(file: File): void {
    this.driversService.uploadVehicleLogBookImage(file).subscribe(
      (uploadResponse: { avatar: string }) => {
        this.vehicleBack = uploadResponse.avatar;
        this.toastService.success(
          'Vehicle Log Book Image Uploaded Successfully'
        );
      },
      (error: any) => {
        console.error('Error uploading file:', error);
      }
    );
  }

  uploadDrivingLicense(file: File): void {
    this.driversService.uploadDrivingLicenseImg(file).subscribe(
      (uploadResponse: { avatar: string }) => {
        this.drivingLicenseName = uploadResponse.avatar;
        this.toastService.success(
          'Driving License Image Uploaded Successfully'
        );
      },
      (error: any) => {
        console.error('Error uploading file:', error);
      }
    );
  }

  uploadBusinessLicense(file: File): void {
    this.driversService.uploadBusinessLicenseImg(file).subscribe(
      (uploadResponse: { avatar: string }) => {
        this.businessLicenseName = uploadResponse.avatar;
        this.toastService.success(
          'Business License Image Uploaded Successfully'
        );
      },
      (error: any) => {
        console.error('Error uploading file:', error);
      }
    );
  }

  create(driver: DriverCreate): Promise<any> {
    return firstValueFrom(this.driversService.createDriver(driver));
  }

  submit() {
    this.busy = true;
    let phone: Phone = {
      code: '251',
      number: this.firstFormGroup.get('phone')?.value?.toString()!,
    };
    let address: Address = {
      city: this.secondFormGroup.get('city')?.value!,
      region: this.secondFormGroup.get('region')?.value!,
      country: this.country,
    };
    let driver: DriverCreate = {
      name: this.firstFormGroup.get('name')!.value!,
      email: this.firstFormGroup.get('email')?.value!,
      password: this.firstFormGroup.get('password')?.value!,
      plateNumber: this.thirdFormGroup.get('plateNumber')?.value!,
      plateNumberCode: this.thirdFormGroup.get('plateNumber')?.value!,
      isAssigned: false,
      phone: phone,
      avatar: this.avatarName,
      vehicleBack: this.vehicleBack,
      vehicleFront: this.vehicleFront,
      vehicleLogBook: this.vehicleLog,
      drivingLicense: this.drivingLicenseName,
      businessLicense: this.businessLicenseName,

      roleId: this.fifthFormGroup.get('roleId')?.value!,
      vehicleId: this.fifthFormGroup.get('vehicleId')?.value!,
      routeId: this.fifthFormGroup.get('routeId')?.value!,
      timingId: this.fifthFormGroup.get('timingId')?.value!,
      tripTypeId: this.fifthFormGroup.get('tripTypeId')?.value!,
      actionBy: this.userType,
      address: address,
    };
    console.log('Driver to be created:', driver);
    this.create(driver)
      .then(
        (result) => {
          if (this.avatar) {
            this.driversService.uploadAvatar(this.avatar).subscribe(
              (response) => {
                driver.avatar = response.name;
                this.toastService.success('Avatar uploaded successfully');
              },
              (error) => {
                this.toastService.error('Error uploading avatar');
                console.error('Error uploading file:', error);
              }
            );
          }
          // if (driver.vehicleBack !== '') {
          //   this.uploadVehicleBack(this.avatar);
          // }
          // if (driver.vehicleFront !== '') {
          //   this.uploadVehicleFront(this.avatar);
          // }
          // if (driver.vehicleLogBook !== '') {
          //   this.uploadVehicleLogBook(this.avatar);
          // }
          // if (driver.drivingLicense !== '') {
          //   this.uploadDrivingLicense(this.avatar);
          // }
          // if (driver.businessLicense !== '') {
          //   this.uploadBusinessLicense(this.avatar);
          // }
          this.toastService.success('Driver Successfully Created');
        },
        (reject) => {
          this.toastService.error('An error occurred during registration');
        }
      )
      .catch((error) => {
        this.toastService.error('An error occurred during registration');
      })
      .finally(() => {
        this.busy = false;
      });
  }
}
