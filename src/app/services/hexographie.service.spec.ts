import {TestBed} from '@angular/core/testing';

import {HexographieService} from './hexographie.service';

describe('HexographieService', () => {
  let service: HexographieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HexographieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
