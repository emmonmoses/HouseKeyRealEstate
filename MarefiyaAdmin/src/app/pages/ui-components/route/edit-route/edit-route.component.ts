import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { MessageService } from 'src/app/services/message.service';
import { Location } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { Route } from 'src/app/model/route/route.model';
import { VehiclesService } from '../../vehicles/vehicles.service';
import { LocationService } from '../../location/location.service';
import { Vehicle } from 'src/app/model/Vehicles/vehicle.model';
import { Locations } from 'src/app/model/locations/location.model';
import { StorageService } from 'src/app/services/storage.service';
import { KeyService } from 'src/app/services/key.service';
import { RouteService } from '../route.service';
import { UpdateRoute } from 'src/app/model/route/route-update.model';

@Component({
  selector: 'app-edit-route',
  templateUrl: './edit-route.component.html',
  styleUrl: './edit-route.component.scss',
})
export class EditRouteComponent implements OnInit {
  route!: Route;
  model: UpdateRoute = new UpdateRoute();
  busy: boolean = false;
  pages: number[] = [];
  page = 1;
  pageSize = 10;
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
    private routeService: RouteService,
    private location: Location,
    private storageService: StorageService,
    private keyService: KeyService
  ) {}

  ngOnInit(): void {
    this.busy = true;
    this.route = this.storageService.getData(this.keyService.ROUTING_KEY);
    this.populateData(this.route);
    this.getAllVehicles();
    this.getAllLocation();
    this.busy = false;
  }

  populateData(arg: Route) {
    this.form.get('name')?.setValue(arg.name);
    this.form.get('price')?.setValue(arg.price);
    this.form.get('pickupLocationId')?.setValue(arg.pickupLocation.id);
    this.form.get('dropLocationId')?.setValue(arg.dropLocation.id);

    this.form.get('vehicleTypeId')?.setValue(arg.vehicle.id ?? null);
    this.form.get('status')?.setValue(arg.status);
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

  update(route: UpdateRoute) {
    return lastValueFrom(this.routeService.updateRoute(route));
  }

  updateRoute() {
    this.busy = true;

    this.model.name = this.form.get('name')?.value!;
    this.model.price = this.form.get('price')!.value!;
    this.model.pickupLocationId = this.form.get('pickupLocationId')?.value!;
    this.model.dropLocationId = this.form.get('dropLocationId')?.value!;
    this.model.vehicleTypeId = this.form.get('vehicleTypeId')!.value!;
    this.model.status = this.form.get('status')!.value!;
    this.model.id = this.route.id;

    this.update(this.model)
      .then(
        (result) => {
          this.toastService.success('Success');
          this.location.back();
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
