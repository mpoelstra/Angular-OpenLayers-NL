import { TestBed, inject } from '@angular/core/testing';

import { OpenlayersService } from './openlayers.service';

describe('OpenlayersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OpenlayersService]
    });
  });

  it('should be created', inject([OpenlayersService], (service: OpenlayersService) => {
    expect(service).toBeTruthy();
  }));
});
