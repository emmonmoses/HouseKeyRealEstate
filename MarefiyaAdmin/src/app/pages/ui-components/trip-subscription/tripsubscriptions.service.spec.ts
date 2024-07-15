import { TestBed } from '@angular/core/testing';

import { TripsubscriptionsService } from './tripsubscriptions.service';

describe('TripsubscriptionsService', () => {
  let service: TripsubscriptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripsubscriptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
