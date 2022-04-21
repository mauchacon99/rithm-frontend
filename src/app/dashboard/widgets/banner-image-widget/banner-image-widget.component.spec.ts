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
  let errorService: ErrorService;
  let documentService: DocumentService;

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
    errorService = TestBed.inject(ErrorService);
    documentService = TestBed.inject(DocumentService);
    fixture = TestBed.createComponent(BannerImageWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call method getImageByRithmId', () => {
    const spyService = spyOn(
      documentService,
      'getImageByRithmId'
    ).and.callThrough();
    component.image = image;

    expect(spyService).toHaveBeenCalledOnceWith(image.imageId);
  });

  it('should show error if the request getImageByRithmId fail', () => {
    const spyService = spyOn(
      documentService,
      'getImageByRithmId'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(errorService, 'displayError').and.callThrough();
    component.image = image;

    expect(spyService).toHaveBeenCalledOnceWith(image.imageId);
    expect(spyError).toHaveBeenCalled();
  });

  describe('Input image', () => {
    it('should get image by imageId', () => {
      const spyService = spyOn(
        documentService,
        'getImageByRithmId'
      ).and.callThrough();

      component.image = image;

      expect(component.imageSrc).toEqual('');
      expect(component.image).toEqual(image);
      expect(spyService).toHaveBeenCalledOnceWith(image.imageId);
    });

    it('should loading image while upload image', () => {
      const expectedImage = {
        imageId: null,
        imageName: null,
      };
      component.image = {
        imageId: 'TEMPLoading',
        imageName: null,
      };

      expect(component.imageSrc).toEqual('');
      expect(component.image).toEqual(expectedImage);
      expect(component.isLoading).toBeTrue();
    });

    it('should set image to null', () => {
      const expectedImage = {
        imageId: null,
        imageName: null,
      };
      component.image = expectedImage;

      expect(component.imageSrc).toEqual('');
      expect(component.image).toEqual(expectedImage);
      expect(component.isLoading).toBeFalse();
    });
  });
});
