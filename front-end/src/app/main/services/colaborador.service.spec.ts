import { TestBed } from '@angular/core/testing';

import { ColaboradorService } from './colaborador.service';

describe('ColaboradorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ColaboradorService = TestBed.get(ColaboradorService);
    expect(service).toBeTruthy();
  });
});
