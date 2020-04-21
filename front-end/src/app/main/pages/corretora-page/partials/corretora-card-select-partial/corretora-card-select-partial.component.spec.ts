import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorretoraCardSelectPartialComponent } from './corretora-card-select-partial.component';

describe('CorretoraCardSelectPartialComponent', () => {
  let component: CorretoraCardSelectPartialComponent;
  let fixture: ComponentFixture<CorretoraCardSelectPartialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorretoraCardSelectPartialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorretoraCardSelectPartialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
