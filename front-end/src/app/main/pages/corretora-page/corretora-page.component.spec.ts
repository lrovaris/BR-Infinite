import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorretoraPageComponent } from './corretora-page.component';

describe('CorretoraPageComponent', () => {
  let component: CorretoraPageComponent;
  let fixture: ComponentFixture<CorretoraPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorretoraPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorretoraPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
