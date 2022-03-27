import { ComponentFixture, TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';
import { MockComponent } from 'ng-mocks';

import { BannerImageWidgetComponent } from './banner-image-widget.component';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { MockDocumentService, MockErrorService } from 'src/mocks';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';

describe('BannerImageWidgetComponent', () => {
  let component: BannerImageWidgetComponent;
  let fixture: ComponentFixture<BannerImageWidgetComponent>;

  const image = {
    imageId: '123-456-789',
    imageName: 'Image name',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        BannerImageWidgetComponent,
        MockComponent(LoadingIndicatorComponent),
      ],
      providers: [
        { provide: ErrorService, useClass: MockErrorService },
        { provide: DocumentService, useClass: MockDocumentService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerImageWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call method getImageByRithmId', () => {
    component.image = image;

    const spyMethod = spyOn(
      TestBed.inject(DocumentService),
      'getImageByRithmId'
    ).and.callThrough();

    component.ngOnInit();

    expect(spyMethod).toHaveBeenCalledOnceWith(image.imageId);
  });

  it('should show error if the request getImageByRithmId fail', () => {
    component.image = image;
    const spyMethod = spyOn(
      TestBed.inject(DocumentService),
      'getImageByRithmId'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );

    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();

    component.ngOnInit();

    expect(spyMethod).toHaveBeenCalledOnceWith(image.imageId);
    expect(spyError).toHaveBeenCalled();
  });

  it('should show loading indicator', () => {
    component.isLoading = true;
    fixture.detectChanges();

    const loadingIndicator =
      fixture.debugElement.nativeElement.querySelector('#loading-indicator');
    expect(loadingIndicator).toBeTruthy();
  });
});
