import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducaoSelect2PartialComponent } from './producao-select2-partial.component';

describe('ProducaoSelect2PartialComponent', () => {
  let component: ProducaoSelect2PartialComponent;
  let fixture: ComponentFixture<ProducaoSelect2PartialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProducaoSelect2PartialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducaoSelect2PartialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
