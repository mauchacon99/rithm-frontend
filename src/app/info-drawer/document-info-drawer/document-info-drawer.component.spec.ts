import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorService } from 'src/app/core/error.service';
import { MockErrorService } from 'src/mocks';

import { DocumentInfoDrawerComponent } from './document-info-drawer.component';
import { StationService } from '../../core/station.service';
import { MockUserService } from '../../../mocks/mock-user-service';

describe('DocumentInfoDrawerComponent', () => {
  let component: DocumentInfoDrawerComponent;
  let fixture: ComponentFixture<DocumentInfoDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentInfoDrawerComponent],
      providers: [
        { provide: StationService, useClass: MockUserService },
        { provide: ErrorService, useClass: MockErrorService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentInfoDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
