import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarImageWidgetComponent } from './avatar-image-widget.component';
import { DocumentService } from 'src/app/core/document.service';
import { throwError } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { MockDocumentService, MockErrorService } from 'src/mocks';
import { ImageData } from 'src/models';

describe('AvatarImageWidgetComponent', () => {
  let component: AvatarImageWidgetComponent;
  let fixture: ComponentFixture<AvatarImageWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvatarImageWidgetComponent],
      providers: [
        { provide: ErrorService, useClass: MockErrorService },
        { provide: DocumentService, useClass: MockDocumentService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarImageWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show profile image', () => {
    component.imageData = {
      imageName: 'Test image',
      imageData: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABA',
    };
    fixture.detectChanges();
    const profileImg =
      fixture.debugElement.nativeElement.querySelector('#profile-image');
    const profileIcon =
      fixture.debugElement.nativeElement.querySelector('#profile-icon');

    expect(profileImg).toBeTruthy();
    expect(profileIcon).toBeNull();
  });

  it('should show profile icon', () => {
    component.imageData = {
      imageName: '',
      imageData: '',
    };
    fixture.detectChanges();
    const profileImg =
      fixture.debugElement.nativeElement.querySelector('#profile-image');
    const profileIcon =
      fixture.debugElement.nativeElement.querySelector('#profile-icon');

    expect(profileImg).toBeNull();
    expect(profileIcon).toBeTruthy();
  });

  it('should call method getImageByRithmId', () => {
    const expectedRithmId = '123-456-789';
    const spyService = spyOn(
      TestBed.inject(DocumentService),
      'getImageByRithmId'
    ).and.callThrough();

    component.profileImage = expectedRithmId;

    expect(spyService).toHaveBeenCalledOnceWith(expectedRithmId);
  });

  it('should show error if the request getImageByRithmId fail', () => {
    const expectedRithmId = '123-456-789';
    const expectedDataImage: ImageData = {
      imageName: '',
      imageData: '',
    };
    const spyService = spyOn(
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

    component.profileImage = expectedRithmId;

    expect(spyService).toHaveBeenCalledOnceWith(expectedRithmId);
    expect(spyError).toHaveBeenCalled();
    expect(component.imageData).toEqual(expectedDataImage);
  });

  it('should call method getImageByRithmId when exist a profileImageId', () => {
    const expectedRithmId = '123-456-789';
    const spyService = spyOn(
      TestBed.inject(DocumentService),
      'getImageByRithmId'
    ).and.callThrough();

    component.profileImage = expectedRithmId;

    expect(spyService).toHaveBeenCalledOnceWith(expectedRithmId);
  });

  it('should set imageData empty when profileImageId is null', () => {
    const expectedDataImage: ImageData = {
      imageName: '',
      imageData: '',
    };
    component.profileImage = null;

    expect(component.imageData).toEqual(expectedDataImage);
  });
});
