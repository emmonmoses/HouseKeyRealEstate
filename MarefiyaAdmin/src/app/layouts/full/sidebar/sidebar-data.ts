import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    displayName: 'Dashboard',
    iconName: 'layout-dashboard',
    route: '/dashboard',
  },
  {
    displayName: 'Agents',
    iconName: 'building',
    route: '/ui-components/agent',
  },
  {
    displayName: 'Fee Type',
    iconName: 'arrows-diff',
    route: '/ui-components/fee-type',
  },  
  {
    displayName: 'Bedrooms',
    iconName: 'clock-24',
    route: '/ui-components/bedrooms',
  },
  {
    displayName: 'Customers',
    iconName: 'steering-wheel',
    route: '/ui-components/customer',
  },
  {
    displayName: 'Administrators',
    iconName: 'map-pin',
    route: '/ui-components/location',
  },
  {
    displayName: 'Subscriptions',
    iconName: 'route',
    route: '/ui-components/tripsubscriptions',
  },
  {
    displayName: 'Roles',
    iconName: 'map',
    route: '/ui-components/route',
  },
  {
    displayName: 'Permissions',
    iconName: 'car',
    route: '/ui-components/vehicles',
  },
];
