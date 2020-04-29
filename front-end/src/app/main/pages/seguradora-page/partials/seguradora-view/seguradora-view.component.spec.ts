import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguradoraViewComponent } from './seguradora-view.component';

describe('SeguradoraViewComponent', () => {
  let component: SeguradoraViewComponent;
  let fixture: ComponentFixture<SeguradoraViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeguradoraViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguradoraViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
