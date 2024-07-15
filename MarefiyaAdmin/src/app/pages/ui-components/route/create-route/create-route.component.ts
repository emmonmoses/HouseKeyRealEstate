import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { MessageService } from 'src/app/services/message.service';
import { lastValueFrom } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';
import { KeyService } from 'src/app/services/key.service';
import { CreateRoute } from 'src/app/model/route/route-create.model';
import { VehiclesService } from '../../vehicles/vehicles.service';
import { Vehicle } from 'src/app/model/Vehicles/vehicle.model';
import { Locations } from 'src/app/model/locations/location.model';
import { LocationService } from '../../location/location.service';
import { RouteService } from '../route.service';

@Component({
  selector: 'app-create-route',
  templateUrl: './create-route.component.html',
  styleUrl: './create-route.component.scss',
})
export class CreateRouteComponent implements OnInit {
  [x: string]: any;

  model: CreateRoute = new CreateRoute();
  busy: boolean = false;
  pages: number[] = [];
  page = 1;
  pageSize = 10;
  userType!: string;
  vehicles?: Vehicle[];
  locations?: Locations[];
  selectedRouteId?: string;
  selectedPickUpId?: string;
  selectedDropOffId?: string;

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    price: new FormControl(0, [Validators.required]),
    pickupLocationId: new FormControl('', Validators.required),
    dropLocationId: new FormControl('', [Validators.required]),
    vehicleTypeId: new FormControl('', [Validators.required]),
    status: new FormControl(1, [Validators.required]),
    actionBy: new FormControl('', [Validators.required]),
  });

  constructor(
    private vehiclesService: VehiclesService,
    private locationService: LocationService,
    private toastService: ToastService,
    private messageService: MessageService,
    private keyService: KeyService,
    private storageService: StorageService,
    private routeService: RouteService
  ) {}

  ngOnInit(): void {
    this.busy = true;
    this.userType = this.storageService.getData(this.keyService.USER_TYPE);
    this.getAllVehicles();
    this.getAllLocation();
    this.busy = false;
  }

  onRouteChange(event: any) {
    const role = event.value;
    this.selectedRouteId = role;
  }

  onPickupChange(event: any) {
    const role = event.value;
    this.selectedPickUpId = role;
  }

  onDrop0fLocationChange(event: any) {
    const role = event.value;
    this.selectedDropOffId = role;
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

  getAllLocation() {
    this.busy = true;
    return lastValueFrom(
      this.locationService.getAllLocation(this.page, this.pageSize)
    )
      .then(
        (result) => {
          if (
            result?.data &&
            Array.isArray(result.data) &&
            result.data.length > 0
          ) {
            this.locations = result.data;
            this.pages = Array.from(
              { length: result.pages },
              (_, index) => index + 1
            );
          } else {
            this.locations = [];
            this.toastService.error('No Locations Found');
          }
        },
        (error) => {
          this.toastService.error('No Locations Found');
        }
      )
      .catch((error) => {
        console.error('Error fetching Locations:', error);
      })
      .finally(() => {
        this.busy = false;
      });
  }

  create(route: CreateRoute) {
    return lastValueFrom(this.routeService.createRoute(route));
  }

  createRoute() {
    this.busy = true;
    this.model.name = this.form.get('name')?.value!;
    this.model.price = this.form.get('price')?.value!;
    this.model.pickupLocationId = this.form.get('pickupLocationId')!.value!;
    this.model.dropLocationId = this.form.get('dropLocationId')!.value!;
    this.model.vehicleTypeId = this.form.get('vehicleTypeId')!.value!;
    this.model.status = this.form.get('status')!.value!;

    this.create(this.model)
      .then(
        (result) => {
          this.toastService.success('Success');
          this.form.reset();
        },
        (reject) => {
          this.toastService.error(this.messageService.serverError);
        }
      )
      .catch((error) => {
        this.toastService.error(this.messageService.serverError);
      })
      .finally(() => {
        this.busy = false;
      });
  }
}
