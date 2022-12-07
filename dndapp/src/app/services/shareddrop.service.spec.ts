import { TestBed } from '@angular/core/testing';

import { ShareddropService } from './shareddrop.service';

describe('ShareddropService', () => {
  let service: ShareddropService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShareddropService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
