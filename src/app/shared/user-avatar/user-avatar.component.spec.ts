import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { By } from '@angular/platform-browser';
import { UserAvatarComponent } from './user-avatar.component';
import { MockDocumentService, MockErrorService } from 'src/mocks';
import { ErrorService } from 'src/app/core/error.service';
import { throwError } from 'rxjs';
import { DocumentService } from 'src/app/core/document.service';

describe('UserAvatarComponent', () => {
  let component: UserAvatarComponent;
  let fixture: ComponentFixture<UserAvatarComponent>;
  let documentService: DocumentService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserAvatarComponent],
      imports: [MatTooltipModule, MatBadgeModule],
      providers: [
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: ErrorService, useClass: MockErrorService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    documentService = TestBed.inject(DocumentService);
    fixture = TestBed.createComponent(UserAvatarComponent);
    component = fixture.componentInstance;
    component.firstName = 'tyler';
    component.lastName = 'hendrickson';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct initials', () => {
    expect(component.initials).toEqual('TH');
  });

  it('should display avatar', () => {
    const avatar = fixture.debugElement.query(By.css('#avatar'));
    expect(avatar).toBeTruthy();
    expect(component.initials).toBeTruthy();
  });

  it('should return a check badge', () => {
    component.badgeHover = false;
    component.badge = 'check';
    const badgeValue = component.getBadge();
    expect(badgeValue).toEqual('\u2714');
  });

  it('should return a plus badge', () => {
    component.badgeHover = false;
    component.badge = 'plus';
    const badgeValue = component.getBadge();
    expect(badgeValue).toEqual('\u002b');
  });

  it('should return a minus badge', () => {
    component.badgeHover = false;
    component.badge = 'minus';
    const badgeValue = component.getBadge();
    expect(badgeValue).toEqual('\u2212');
  });

  it('should return a minus badge on mouseover', () => {
    component.badgeHover = true;
    const badgeValue = component.getBadge();
    expect(badgeValue).toEqual('\u2212');
  });

  it('should call method getImageUser', () => {
    component.profileImageRithmId = '123-123132';
    const methodGetImageUserService = spyOn(
      documentService,
      'getImageUser'
    ).and.callThrough();
    component['getImageUser']();

    expect(methodGetImageUserService).toHaveBeenCalledOnceWith(
      component.profileImageRithmId
    );
  });

  it('should catch an error if the request to get image data', () => {
    component.profileImageRithmId = '123-123132';
    spyOn(documentService, 'getImageUser').and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'logError'
    ).and.callThrough();
    component['getImageUser']();
    expect(spyError).toHaveBeenCalled();
  });

  it('should delete render image when image id is empty', () => {
    component.profileImageRithmId = '';
    expect(component.imageData).toEqual({ imageData: '', imageName: '' });
  });
});
