import { TestBed } from '@angular/core/testing';

import { ResourceEndpointService } from './resource-endpoint.service';

describe('ResourceEndpointService', () => {
  let service: ResourceEndpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourceEndpointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
