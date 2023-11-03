import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationsDetailsComponent } from './consultations-details.component';

describe('ConsultationsDetailsComponent', () => {
  let component: ConsultationsDetailsComponent;
  let fixture: ComponentFixture<ConsultationsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultationsDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultationsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
