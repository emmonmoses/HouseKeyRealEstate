import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { UiComponentsRoutes } from './ui-components.routing';

// ui components
import { AppBadgeComponent } from './badge/badge.component';
import { AppChipsComponent } from './chips/chips.component';
import { AppListsComponent } from './lists/lists.component';
import { AppMenuComponent } from './menu/menu.component';
import { AppTooltipsComponent } from './tooltips/tooltips.component';
import { MatNativeDateModule } from '@angular/material/core';
import { CompanyComponent } from './company/company.component';
import { MatIconModule } from '@angular/material/icon';
import { CreateCompanyComponent } from './company/create-company/create-company.component';
import { MatSelectCountryModule } from '@angular-material-extensions/select-country';
import { EditCompanyComponent } from './company/edit-company/edit-company.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { CreateVehicleComponent } from './vehicles/create-vehicle/create-vehicle.component';
import { EditVehicleComponent } from './vehicles/edit-vehicle/edit-vehicle.component';
import { TripTypeComponent } from './trip-type/trip-type.component';
import { TripTypeCreateComponent } from './trip-type/trip-type-create/trip-type-create.component';
import { TripTypeEditComponent } from './trip-type/trip-type-edit/trip-type-edit.component';
import { LocationComponent } from './location/location.component';
import { CreateLocationComponent } from './location/create-location/create-location.component';
import { EditLocationComponent } from './location/edit-location/edit-location.component';
import { TimingComponent } from './timing/timing.component';
import { EditTimingComponent } from './timing/edit-timing/edit-timing.component';
import { CreateTimingComponent } from './timing/create-timing/create-timing.component';
import { RouteComponent } from './route/route.component';
import { CreateRouteComponent } from './route/create-route/create-route.component';
import { EditRouteComponent } from './route/edit-route/edit-route.component';
import { DriversComponent } from './drivers/drivers.component';
import { CreateDriverComponent } from './drivers/create-driver/create-driver.component';
import { EditDriverComponent } from './drivers/edit-driver/edit-driver.component';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { TripSubscriptionComponent } from './trip-subscription/trip-subscription.component';
import { CreateTripSubscriptionComponent } from './trip-subscription/create-trip-subscription/create-trip-subscription.component';
import { EditTripSubscriptionComponent } from './trip-subscription/edit-trip-subscription/edit-trip-subscription.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(UiComponentsRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
    MatNativeDateModule,
    MatIconModule,
    NgxMatFileInputModule,
    MatSelectCountryModule.forRoot('en'),
  ],
  declarations: [
    AppBadgeComponent,
    AppChipsComponent,
    AppListsComponent,
    AppMenuComponent,
    AppTooltipsComponent,
    CompanyComponent,
    CreateCompanyComponent,
    EditCompanyComponent,
    VehiclesComponent,
    CreateVehicleComponent,
    EditVehicleComponent,
    TripTypeComponent,
    TripTypeCreateComponent,
    TripTypeEditComponent,
    LocationComponent,
    CreateLocationComponent,
    EditLocationComponent,
    TimingComponent,
    CreateTimingComponent,
    EditTimingComponent,
    RouteComponent,
    CreateRouteComponent,
    EditRouteComponent,
    DriversComponent,
    CreateDriverComponent,
    EditDriverComponent,
    TripSubscriptionComponent,
    CreateTripSubscriptionComponent,
    EditTripSubscriptionComponent,
  ],
})
export class UicomponentsModule {}
