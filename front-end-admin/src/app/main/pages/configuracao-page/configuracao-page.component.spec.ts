import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracaoPageComponent } from './configuracao-page.component';

describe('ConfiguracaoPageComponent', () => {
  let component: ConfiguracaoPageComponent;
  let fixture: ComponentFixture<ConfiguracaoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfiguracaoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracaoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
