import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguradoraCardPartialComponent } from './seguradora-card-partial.component';

describe('SeguradoraCardPartialComponent', () => {
  let component: SeguradoraCardPartialComponent;
  let fixture: ComponentFixture<SeguradoraCardPartialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeguradoraCardPartialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguradoraCardPartialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
