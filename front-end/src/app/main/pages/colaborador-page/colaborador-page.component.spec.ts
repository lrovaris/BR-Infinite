import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColaboradorPageComponent } from './colaborador-page.component';

describe('ColaboradorPageComponent', () => {
  let component: ColaboradorPageComponent;
  let fixture: ComponentFixture<ColaboradorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColaboradorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColaboradorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
