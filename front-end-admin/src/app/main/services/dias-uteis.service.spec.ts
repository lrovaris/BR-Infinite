import { TestBed } from '@angular/core/testing';

import { DiasUteisService } from './dias-uteis.service';

describe('DiasUteisService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DiasUteisService = TestBed.get(DiasUteisService);
    expect(service).toBeTruthy();
  });
});
