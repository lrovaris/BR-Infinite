import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducaoCorretoraDiarioComponent } from './producao-corretora-diario.component';

describe('ProducaoCorretoraDiarioComponent', () => {
  let component: ProducaoCorretoraDiarioComponent;
  let fixture: ComponentFixture<ProducaoCorretoraDiarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProducaoCorretoraDiarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducaoCorretoraDiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
