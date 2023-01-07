import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitsuccessComponent } from './initsuccess.component';

describe('InitsuccessComponent', () => {
  let component: InitsuccessComponent;
  let fixture: ComponentFixture<InitsuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitsuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitsuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
