import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickViewScaleComponent } from './quick-view-scale.component';

describe('QuickViewScaleComponent', () => {
  let component: QuickViewScaleComponent;
  let fixture: ComponentFixture<QuickViewScaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickViewScaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickViewScaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
