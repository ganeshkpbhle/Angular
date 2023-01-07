import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumcardComponent } from './numcard.component';

describe('NumcardComponent', () => {
  let component: NumcardComponent;
  let fixture: ComponentFixture<NumcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumcardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
