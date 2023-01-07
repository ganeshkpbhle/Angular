import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatuscardComponent } from './statuscard.component';

describe('StatuscardComponent', () => {
  let component: StatuscardComponent;
  let fixture: ComponentFixture<StatuscardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatuscardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatuscardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
