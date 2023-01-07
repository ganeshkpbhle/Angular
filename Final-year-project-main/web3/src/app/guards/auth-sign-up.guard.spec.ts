import { TestBed } from '@angular/core/testing';

import { AuthSignUpGuard } from './auth-sign-up.guard';

describe('AuthSignUpGuard', () => {
  let guard: AuthSignUpGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthSignUpGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
