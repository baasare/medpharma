import {TestBed} from '@angular/core/testing';

import {ConsultationService} from './consultation.service';

describe('InstitutionService', () => {
  let service: ConsultationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
