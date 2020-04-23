import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSeguradoraComponent } from './list-seguradora.component';

describe('ListSeguradoraComponent', () => {
  let component: ListSeguradoraComponent;
  let fixture: ComponentFixture<ListSeguradoraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSeguradoraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSeguradoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
