import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducaoAnualPartialComponent } from './producao-anual-partial.component';

describe('ProducaoAnualPartialComponent', () => {
  let component: ProducaoAnualPartialComponent;
  let fixture: ComponentFixture<ProducaoAnualPartialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProducaoAnualPartialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducaoAnualPartialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
