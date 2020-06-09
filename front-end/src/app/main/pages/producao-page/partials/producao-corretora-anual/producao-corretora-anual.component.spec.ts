import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducaoCorretoraAnualComponent } from './producao-corretora-anual.component';

describe('ProducaoCorretoraAnualComponent', () => {
  let component: ProducaoCorretoraAnualComponent;
  let fixture: ComponentFixture<ProducaoCorretoraAnualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProducaoCorretoraAnualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducaoCorretoraAnualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
