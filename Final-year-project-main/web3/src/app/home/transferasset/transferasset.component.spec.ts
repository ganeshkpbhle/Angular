import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferassetComponent } from './transferasset.component';

describe('TransferassetComponent', () => {
  let component: TransferassetComponent;
  let fixture: ComponentFixture<TransferassetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferassetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferassetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
