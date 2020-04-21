import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelinePageComponent } from './pipeline-page.component';

describe('PipelinePageComponent', () => {
  let component: PipelinePageComponent;
  let fixture: ComponentFixture<PipelinePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipelinePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelinePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
