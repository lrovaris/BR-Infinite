import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducaoMensalPartialComponent } from './producao-mensal-partial.component';

describe('ProducaoMensalPartialComponent', () => {
  let component: ProducaoMensalPartialComponent;
  let fixture: ComponentFixture<ProducaoMensalPartialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProducaoMensalPartialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducaoMensalPartialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
