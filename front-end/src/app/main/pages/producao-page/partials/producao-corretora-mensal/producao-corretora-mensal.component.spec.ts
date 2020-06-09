import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducaoCorretoraMensalComponent } from './producao-corretora-mensal.component';

describe('ProducaoCorretoraMensalComponent', () => {
  let component: ProducaoCorretoraMensalComponent;
  let fixture: ComponentFixture<ProducaoCorretoraMensalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProducaoCorretoraMensalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducaoCorretoraMensalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
