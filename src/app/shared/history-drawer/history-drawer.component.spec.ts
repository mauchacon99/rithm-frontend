import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HistoryDrawerComponent } from './history-drawer.component';
import { DocumentService } from 'src/app/core/document.service';
import { MockDocumentService } from 'src/mocks';

describe('HistoryDrawerComponent', () => {
  let component: HistoryDrawerComponent;
  let fixture: ComponentFixture<HistoryDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatSnackBarModule],
      declarations: [HistoryDrawerComponent],
      providers: [
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the method that returns events of document', () => {
    component.documentRithmId = 'E204F369-386F-4E41';
    const getEventDocument = spyOn(
      TestBed.inject(DocumentService),
      'getDocumentEvents'
    ).and.callThrough();
    component.ngOnInit();
    expect(getEventDocument).toHaveBeenCalledWith(component.documentRithmId);
  });
});
