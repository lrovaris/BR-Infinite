import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducaoSelectPartialComponent } from './producao-select-partial.component';

describe('ProducaoSelectPartialComponent', () => {
  let component: ProducaoSelectPartialComponent;
  let fixture: ComponentFixture<ProducaoSelectPartialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProducaoSelectPartialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducaoSelectPartialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
