import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorretoraViewComponent } from './corretora-view.component';

describe('CorretoraViewComponent', () => {
  let component: CorretoraViewComponent;
  let fixture: ComponentFixture<CorretoraViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorretoraViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorretoraViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
