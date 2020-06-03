import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducaoSelectCorretoraSeguradoraPartialComponent } from './producao-select-corretora-seguradora-partial.component';

describe('ProducaoSelectCorretoraSeguradoraPartialComponent', () => {
  let component: ProducaoSelectCorretoraSeguradoraPartialComponent;
  let fixture: ComponentFixture<ProducaoSelectCorretoraSeguradoraPartialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProducaoSelectCorretoraSeguradoraPartialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducaoSelectCorretoraSeguradoraPartialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
