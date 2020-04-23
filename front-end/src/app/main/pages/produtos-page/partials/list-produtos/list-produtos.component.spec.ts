import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProdutosComponent } from './list-produtos.component';

describe('ListProdutosComponent', () => {
  let component: ListProdutosComponent;
  let fixture: ComponentFixture<ListProdutosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListProdutosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListProdutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
