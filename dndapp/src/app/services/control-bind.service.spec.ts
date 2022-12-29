import { TestBed } from '@angular/core/testing';

import { ControlBindService } from './control-bind.service';

describe('ControlBindService', () => {
  let service: ControlBindService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlBindService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
