import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomeventComponent } from './customevent.component';

describe('CustomeventComponent', () => {
  let component: CustomeventComponent;
  let fixture: ComponentFixture<CustomeventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomeventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomeventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
