import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class KeyService {
  TOKEN_KEY = 'token';
  COMPANYID_KEY = 'companyId';
  EMAIL_KEY = 'email';
  USER_NAME_KEY = 'user name';
  USER_TYPE = 'user type';
  AVATAR_KEY = 'avatar';
  USERID_KEY = 'userID';

  SETTINGS_KEY = 'settings';

  PERMISSION_KEY = 'permission';
  ROLE_KEY = 'role';
  STOCK_KEY = 'stock';

  USEROBJECT_KEY = 'userObject';
  COMPANYOBJECT_KEY = 'companyObject';
  CLAIMS_KEY = 'claimsArray';
  CLAIMS_KEY_ROW = 'clamimsArrayRow';
  USERTYPE_KEY = 'usertype';
  USERTYPE_ID = 'usertypeId';
  USERTYPE_NAME = 'usertypeName';
  VEHICLEOBJECT_KEY = 'vehicleObject';
  TRIPTYPE_KEY = 'tripType';
  LOCATION_kEY = 'location';
  TIMING_KEY = 'timing';
  ROUTING_KEY = 'routing';
  DRIVER_KEY = 'driver';
}
