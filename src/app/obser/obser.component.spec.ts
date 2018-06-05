import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObserComponent } from './obser.component';

describe('ObserComponent', () => {
  let component: ObserComponent;
  let fixture: ComponentFixture<ObserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
