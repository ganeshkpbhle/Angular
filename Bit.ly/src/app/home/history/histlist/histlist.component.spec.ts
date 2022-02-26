import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistlistComponent } from './histlist.component';

describe('HistlistComponent', () => {
  let component: HistlistComponent;
  let fixture: ComponentFixture<HistlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
