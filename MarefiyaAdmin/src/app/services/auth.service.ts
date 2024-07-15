import { Injectable } from '@angular/core';
import { BaseService } from '../shared/base.service';
import { StorageService } from './storage.service';
import { KeyService } from './key.service';
import { Company } from '../model/company/company.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  constructor(
    public storageService: StorageService,
    public keyService: KeyService
  ) {
    super();
  }

  get getToken(): string {
    return this.storageService.getData(this.keyService.TOKEN_KEY);
  }

  get getCompanyId(): string {
    return this.storageService.getData(this.keyService.COMPANYID_KEY);
  }

  get getUserEmail(): string {
    return this.storageService.getData(this.keyService.EMAIL_KEY);
  }

  get getAvatar(): string {
    return this.storageService.getData(this.keyService.AVATAR_KEY);
  }

  get getUserId(): string {
    return this.storageService.getData(this.keyService.USERID_KEY);
  }

  deleteUserObject(): void {
    this.storageService.deleteData(this.keyService.USEROBJECT_KEY);
  }

  get getCompanyObject(): Company {
    return this.storageService.getData(this.keyService.COMPANYOBJECT_KEY);
  }

  deleteCompanyObject(): void {
    this.storageService.deleteData(this.keyService.COMPANYOBJECT_KEY);
  }

  get getUserTypeId(): string {
    return this.storageService.getData(this.keyService.USERTYPE_ID);
  }
}
