import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HistoryDrawerComponent } from './history-drawer.component';
import { DocumentService } from 'src/app/core/document.service';
import { MockDocumentService, MockErrorService } from 'src/mocks';
import { UserAvatarModule } from '../user-avatar/user-avatar.module';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { MockComponent } from 'ng-mocks';
import { throwError } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';

describe('HistoryDrawerComponent', () => {
  let component: HistoryDrawerComponent;
  let fixture: ComponentFixture<HistoryDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule, UserAvatarModule],
      declarations: [
        HistoryDrawerComponent,
        MockComponent(LoadingIndicatorComponent),
      ],
      providers: [
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: ErrorService, useClass: MockErrorService },
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

  it('should show error if events document fails', () => {
    spyOn(TestBed.inject(DocumentService), 'getDocumentEvents').and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.eventDocumentsError).toBeTrue();
    const reviewError = fixture.debugElement.nativeElement.querySelector(
      '#events-documents-error'
    );
    expect(reviewError).toBeTruthy();
  });

  it('should activate the history loading', () => {
    const eventDocumentsLoading =
      fixture.debugElement.nativeElement.querySelector(
        '#loading-indicator-history'
      );
    component.eventDocumentsLoading = true;
    fixture.detectChanges();
    expect(eventDocumentsLoading).toBeTruthy();
  });
});
