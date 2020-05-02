import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoViewComponent } from './produto-view.component';

describe('ProdutoViewComponent', () => {
  let component: ProdutoViewComponent;
  let fixture: ComponentFixture<ProdutoViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdutoViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdutoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
