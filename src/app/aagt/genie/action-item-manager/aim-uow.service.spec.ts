import { TestBed } from '@angular/core/testing';

import { AimUowService } from './aim-uow.service';

describe('AimUowService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AimUowService = TestBed.get(AimUowService);
    expect(service).toBeTruthy();
  });
});
