import { TestBed } from '@angular/core/testing';

import { TripTypeService } from './trip-type.service';

describe('TripTypeService', () => {
  let service: TripTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
