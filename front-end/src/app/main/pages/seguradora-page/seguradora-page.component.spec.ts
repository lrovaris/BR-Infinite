import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguradoraPageComponent } from './seguradora-page.component';

describe('SeguradoraPageComponent', () => {
  let component: SeguradoraPageComponent;
  let fixture: ComponentFixture<SeguradoraPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeguradoraPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguradoraPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
