import { TestBed } from '@angular/core/testing';

import { GenieUowService } from './genie-uow.service';

describe('GenieUowService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GenieUowService = TestBed.get(GenieUowService);
    expect(service).toBeTruthy();
  });
});
