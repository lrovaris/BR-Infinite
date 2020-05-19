import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducaoEnviarAnexoPartialComponent } from './producao-enviar-anexo-partial.component';

describe('ProducaoEnviarAnexoPartialComponent', () => {
  let component: ProducaoEnviarAnexoPartialComponent;
  let fixture: ComponentFixture<ProducaoEnviarAnexoPartialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProducaoEnviarAnexoPartialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducaoEnviarAnexoPartialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
