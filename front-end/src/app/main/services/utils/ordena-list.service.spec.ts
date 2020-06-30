import { TestBed } from '@angular/core/testing';

import { OrdenaListService } from './ordena-list.service';

describe('OrdenaListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrdenaListService = TestBed.get(OrdenaListService);
    expect(service).toBeTruthy();
  });
});
