import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCorretoraComponent } from './list-corretora.component';

describe('ListCorretoraComponent', () => {
  let component: ListCorretoraComponent;
  let fixture: ComponentFixture<ListCorretoraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCorretoraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCorretoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
