import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import {
  MockDocumentService,
  MockErrorService,
  MockPopupService,
} from 'src/mocks';
import { UploadFileModalComponent } from './upload-file-modal.component';
import { PopupService } from 'src/app/core/popup.service';

describe('UploadFileModalComponent', () => {
  let component: UploadFileModalComponent;
  let fixture: ComponentFixture<UploadFileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: MatDialogRef, useValue: { close } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: ErrorService, useValue: MockErrorService },
        { provide: PopupService, useValue: MockPopupService },
      ],
      declarations: [UploadFileModalComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call close the modal when the close-modal-btn is pressed', () => {
    const spyMatDialogRef = spyOn(TestBed.inject(MatDialogRef), 'close');
    const spyMethod = spyOn(component, 'closeModal').and.callThrough();
    const btnClose = fixture.nativeElement.querySelector('#close-modal-btn');
    expect(btnClose).toBeTruthy();
    btnClose.click();
    expect(spyMethod).toHaveBeenCalled();
    expect(spyMatDialogRef).toHaveBeenCalled();
  });

  it('should close the modal for upload file', () => {
    const spyMatDialogRef = spyOn(TestBed.inject(MatDialogRef), 'close');
    const spyMethod = spyOn(component, 'closeModal').and.callThrough();
    const btnClose = fixture.nativeElement.querySelector('#close-modal-btn');
    expect(btnClose).toBeTruthy();
    btnClose.click();
    expect(spyMethod).toHaveBeenCalled();
    expect(spyMatDialogRef).toHaveBeenCalled();
  });

  it('should upload the file once any file is dragged', () => {
    const mockFile = [
      {
        lastModified: '1649560275133',
        lastModifiedDate: new Date(0),
        name: 'MyFile.png',
        size: 46565,
        type: 'image/png',
        webkitRelativePath: '',
        item: '',
      },
    ] as unknown;
    const spyUpdateField = spyOn(component, 'updateFieldAnswer');
    const files = mockFile as FileList;
    component.onFilesDragged(mockFile as FileList);
    expect(component.file).toBe(files[0]);
    expect(spyUpdateField).toHaveBeenCalled();
  });
});
