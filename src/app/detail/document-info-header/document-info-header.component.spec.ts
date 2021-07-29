import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DocumentInfoHeaderComponent } from './document-info-header.component';

describe('DocumentInfoHeaderComponent', () => {
  let component: DocumentInfoHeaderComponent;
  let fixture: ComponentFixture<DocumentInfoHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentInfoHeaderComponent],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatInputModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentInfoHeaderComponent);
    component = fixture.componentInstance;
    component.documentInformation = {
      documentName: 'Metroid Dread',
      documentPriority: 5,
      documentRithmId: 'E204F369-386F-4E41',
      currentAssignedUser: 'NS',
      flowedTimeUTC: '1943827200000',
      lastUpdatedUTC: '1943827200000',
      stationId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      stationName: 'Development',
      stationPriority: 2,
      numberOfSupervisors: 7,
      supervisorRoster: [{ firstName: 'Supervisor', lastName: 'User', isAssigned: false, email: 'supervisoruser@inpivota.com' }],
      numberOfWorkers: 7,
      workerRoster: [{firstName: 'Worker', lastName : 'User', isAssigned: false, email: 'workeruser@inpivota.com'},
      { firstName: 'Harry', lastName: 'Potter', isAssigned: false, email: 'harrypotter@inpivota.com' }]
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
