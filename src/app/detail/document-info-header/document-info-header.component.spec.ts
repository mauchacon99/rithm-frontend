import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DocumentInfoHeaderComponent } from './document-info-header.component';

describe('DocumentInfoHeaderComponent', () => {
  let component: DocumentInfoHeaderComponent;
  let fixture: ComponentFixture<DocumentInfoHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentInfoHeaderComponent ],
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentInfoHeaderComponent);
    component = fixture.componentInstance;
    component.documentInformation = {
      documentName: 'Requirement',
      documentPriority: 1,
      currentAssignedUser: 'WU',
      flowedTimeUTC: '1943827200000',
      lastUpdatedUTC: '1943827200000',
      stationName: 'Development',
      stationPriority: 2,
      supervisorRoster: ['MP', 'RU', 'HP'],
      workerRoster: []
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
