import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { throwError } from 'rxjs';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { MockDocumentService, MockErrorService } from 'src/mocks';
import { StationWidgetComponent } from './station-widget.component';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { MockComponent } from 'ng-mocks';
import { By } from '@angular/platform-browser';

describe('StationWidgetComponent', () => {
  let component: StationWidgetComponent;
  let fixture: ComponentFixture<StationWidgetComponent>;
  const stationRithmId =
    '{"stationRithmId":"247cf568-27a4-4968-9338-046ccfee24f3"}';
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StationWidgetComponent,
        MockComponent(LoadingIndicatorComponent),
      ],
      imports: [MatCardModule],
      providers: [
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: ErrorService, useClass: MockErrorService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationWidgetComponent);
    component = fixture.componentInstance;
    component.stationRithmId = stationRithmId;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call service that return station widget data', () => {
    const spyService = spyOn(
      TestBed.inject(DocumentService),
      'getStationWidgetDocuments'
    ).and.callThrough();
    component.stationRithmId = stationRithmId;
    component.ngOnInit();
    expect(spyService).toHaveBeenCalledOnceWith(component.stationRithmId);
  });

  it('should show error message when request station widget document  data', () => {
    spyOn(
      TestBed.inject(DocumentService),
      'getStationWidgetDocuments'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyService = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component.stationRithmId = stationRithmId;
    component.ngOnInit();
    expect(spyService).toHaveBeenCalled();
  });

  describe('Loading documents', () => {
    it('should be to show loading-indicator', () => {
      component.isLoading = true;
      fixture.detectChanges();
      const loadingDocs = fixture.debugElement.query(By.css('#loadingDocs'));
      const showDocs = fixture.debugElement.query(By.css('#showDocs'));
      const loadingIndicator = fixture.debugElement.query(
        By.css('app-loading-indicator')
      );

      expect(loadingDocs).toBeTruthy();
      expect(loadingIndicator).toBeTruthy();
      expect(showDocs).toBeNull();
    });

    it('should not be to show loading-indicator', () => {
      component.isLoading = false;
      fixture.detectChanges();
      const loadingDocs = fixture.debugElement.query(By.css('#loadingDocs'));
      const showDocs = fixture.debugElement.query(By.css('#showDocs'));
      const loadingIndicator = fixture.debugElement.query(
        By.css('app-loading-indicator')
      );

      expect(loadingDocs).toBeNull();
      expect(loadingIndicator).toBeNull();
      expect(showDocs).toBeTruthy();
    });
  });
});
