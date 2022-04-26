import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { DataLinkModalComponent } from './data-link-modal.component';

describe('DataLinkModalComponent', () => {
  let component: DataLinkModalComponent;
  let fixture: ComponentFixture<DataLinkModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataLinkModalComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close } },
        { provide: MatDialog, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataLinkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call close the modal in dialogRef service', () => {
    const spyMatDialogRef = spyOn(TestBed.inject(MatDialogRef), 'close');
    const spyMethod = spyOn(component, 'closeModalHelp').and.callThrough();
    const btnClose = fixture.nativeElement.querySelector('#help-modal-close');
    expect(btnClose).toBeTruthy();
    btnClose.click();
    expect(spyMethod).toHaveBeenCalled();
    expect(spyMatDialogRef).toHaveBeenCalled();
  });
});
