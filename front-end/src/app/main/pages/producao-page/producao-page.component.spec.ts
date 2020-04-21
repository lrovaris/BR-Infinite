import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducaoPageComponent } from './producao-page.component';

describe('ProducaoPageComponent', () => {
  let component: ProducaoPageComponent;
  let fixture: ComponentFixture<ProducaoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProducaoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducaoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
