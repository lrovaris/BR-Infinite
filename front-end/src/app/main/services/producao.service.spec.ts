import { TestBed } from '@angular/core/testing';

import { ProducaoService } from './producao.service';

describe('ProducaoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProducaoService = TestBed.get(ProducaoService);
    expect(service).toBeTruthy();
  });
});
