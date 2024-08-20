import { Routes } from '@angular/router';

// ui
import { AppBadgeComponent } from './badge/badge.component';
import { AppChipsComponent } from './chips/chips.component';
import { AppListsComponent } from './lists/lists.component';
import { AppMenuComponent } from './menu/menu.component';
import { AppTooltipsComponent } from './tooltips/tooltips.component';
import { CompanyComponent } from './company/company.component';
import { CreateCompanyComponent } from './company/create-company/create-company.component';
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
import { CreateTimingComponent } from './timing/create-timing/create-timing.component';
import { EditTimingComponent } from './timing/edit-timing/edit-timing.component';
import { RouteComponent } from './route/route.component';
import { CreateRouteComponent } from './route/create-route/create-route.component';
import { EditRouteComponent } from './route/edit-route/edit-route.component';
import { DriversComponent } from './drivers/drivers.component';
import { CreateDriverComponent } from './drivers/create-driver/create-driver.component';
import { EditDriverComponent } from './drivers/edit-driver/edit-driver.component';
import { EditTripSubscriptionComponent } from './trip-subscription/edit-trip-subscription/edit-trip-subscription.component';
import { CreateTripSubscriptionComponent } from './trip-subscription/create-trip-subscription/create-trip-subscription.component';
import { TripSubscriptionComponent } from './trip-subscription/trip-subscription.component';
import { AgentsComponent } from './agents/agents.component';
import { CreateAgentComponent } from './agents/create-agent/create-agent.component';
import { EditAgentComponent } from './agents/edit-agent/edit-agent.component';
import { FeeTypeComponent } from './fee-type/fee-type.component';
import { CreateFeeTypeComponent } from './fee-type/create-fee-type/create-fee-type.component';
import { EditFeeTypeComponent } from './fee-type/edit-fee-type/edit-fee-type.component';
import { BedroomComponent } from './bedroom/bedroom.component';
import { CreateBedroomComponent } from './bedroom/create-bedroom/create-bedroom.component';
import { EditBedroomComponent } from './bedroom/edit-bedroom/edit-bedroom.component';
import { CustomerComponent } from './customer/customer.component';
import { CreateCustomerComponent } from './customer/create-customer/create-customer.component';
import { EditCustomerComponent } from './customer/edit-customer/edit-customer.component';

export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'company',
        component: CompanyComponent,
      },
      {
        path: 'create-company',
        component: CreateCompanyComponent,
      },
      {
        path: 'edit-company',
        component: EditCompanyComponent,
      },
      {
        path: 'vehicles',
        component: VehiclesComponent,
      },
      {
        path: 'create-vehicle',
        component: CreateVehicleComponent,
      },
      {
        path: 'edit-vehicle',
        component: EditVehicleComponent,
      },

      {
        path: 'tripType',
        component: TripTypeComponent,
      },
      {
        path: 'create-tripType',
        component: TripTypeCreateComponent,
      },
      {
        path: 'edit-tripType',
        component: TripTypeEditComponent,
      },
      {
        path: 'location',
        component: LocationComponent,
      },
      {
        path: 'create-location',
        component: CreateLocationComponent,
      },
      {
        path: 'edit-location',
        component: EditLocationComponent,
      },
      {
        path: 'timing',
        component: TimingComponent,
      },
      {
        path: 'create-timing',
        component: CreateTimingComponent,
      },
      {
        path: 'edit-timing',
        component: EditTimingComponent,
      },
      {
        path: 'route',
        component: RouteComponent,
      },
      {
        path: 'create-route',
        component: CreateRouteComponent,
      },
      {
        path: 'edit-route',
        component: EditRouteComponent,
      },
      {
        path: 'driver',
        component: DriversComponent,
      },
      {
        path: 'create-driver',
        component: CreateDriverComponent,
      },
      {
        path: 'edit-driver',
        component: EditDriverComponent,
      },
      {
        path: 'tripsubscriptions',
        component: TripSubscriptionComponent,
      },
      {
        path: 'create-tripsubscriptions',
        component: CreateTripSubscriptionComponent,
      },
      {
        path: 'edit-tripsubscriptions',
        component: EditTripSubscriptionComponent,
      },
      {
        path: 'badge',
        component: AppBadgeComponent,
      },
      {
        path: 'chips',
        component: AppChipsComponent,
      },
      {
        path: 'lists',
        component: AppListsComponent,
      },
      {
        path: 'menu',
        component: AppMenuComponent,
      },
      {
        path: 'tooltips',
        component: AppTooltipsComponent,
      },
      {
        path: 'agent',
        component: AgentsComponent,
      },
      {
        path: 'create-agent',
        component: CreateAgentComponent,
      },
      {
        path: 'edit-agent',
        component: EditAgentComponent,
      },
      {
        path: 'fee-type',
        component: FeeTypeComponent,
      },
      {
        path: 'create-fee-type',
        component: CreateFeeTypeComponent,
      },
      {
        path: 'edit-fee-type',
        component: EditFeeTypeComponent,
      },
      {
        path: 'bedrooms',
        component: BedroomComponent,
      },
      {
        path: 'create-bedroom',
        component: CreateBedroomComponent,
      },
      {
        path: 'edit-bedroom',
        component: EditBedroomComponent,
      },
      {
        path: 'customer',
        component: CustomerComponent
      },
      {
        path: 'create-customer',
        component: CreateCustomerComponent
      },
      {
        path: 'edit-customer',
        component: EditCustomerComponent,
      }
    ],
  },
];
