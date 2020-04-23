import { TestBed } from '@angular/core/testing';

import { SeguradoraService } from './seguradora.service';

describe('SeguradoraService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SeguradoraService = TestBed.get(SeguradoraService);
    expect(service).toBeTruthy();
  });
});
