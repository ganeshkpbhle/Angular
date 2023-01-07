import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReinitComponent } from './reinit.component';

describe('ReinitComponent', () => {
  let component: ReinitComponent;
  let fixture: ComponentFixture<ReinitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReinitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReinitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
