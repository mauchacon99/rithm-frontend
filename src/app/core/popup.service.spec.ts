import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { DialogData, DialogType } from 'src/models';

import { PopupService } from './popup.service';

describe('PopupService', () => {
  let service: PopupService;
  let dialogSpy: jasmine.Spy;
  let snackBarSpy: jasmine.Spy;
  // eslint-disable-next-line rxjs/finnish
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };
  const dialogWithWidth: DialogData = {
    type: DialogType.Terms,
    title: 'Terms and Conditions',
    message: 'Returns terms and conditions',
    okButtonText: 'Agree',
    width: '90%'
  };
  const dialogWithoutWidth: DialogData = {
    type: DialogType.Terms,
    title: 'Terms and Conditions',
    message: 'Returns terms and conditions',
    okButtonText: 'Agree',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatSnackBarModule
      ]
    });
    service = TestBed.inject(PopupService);
  });

  beforeEach(() => {
    dialogSpy = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    snackBarSpy = spyOn(TestBed.inject(MatSnackBar), 'open');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should display an alert dialog to the user ', () => {
    service.alert(dialogWithWidth);
    expect(dialogSpy).toHaveBeenCalledTimes(1);
    // expect(dialogRefSpyObj.afterClosed).toHaveBeenCalledTimes(1);
  });

  it('should display a confirmation dialog to the user `dialog object passed with width property`', () => {
    service.confirm(dialogWithWidth);
    expect(dialogSpy).toHaveBeenCalledTimes(1);
    // expect(dialogRefSpyObj.afterClosed).toHaveBeenCalledTimes(1);
  });

  it('should display a confirmation dialog to the user `dialog object passed without width property`', () => {
    service.confirm(dialogWithoutWidth);
    expect(dialogSpy).toHaveBeenCalledTimes(1);
    // expect(dialogRefSpyObj.afterClosed).toHaveBeenCalledTimes(1);
  });

  it('should display a prompt dialog to the user', () => {
    service.prompt(dialogWithWidth);
    expect(dialogSpy).toHaveBeenCalledTimes(1);
    // expect(dialogRefSpyObj.afterClosed).toHaveBeenCalledTimes(1);
  });

  it('should Display a snackbar popup at the bottom of the window `error = false', () => {
    service.notify('mock notification');
    expect(snackBarSpy).toHaveBeenCalledWith('mock notification', 'OK', {
      duration: 3500,
      panelClass: 'snackbar'
    });
  });

  it('should Display a snackbar popup at the bottom of the window `error = true', () => {
    service.notify('mock notification', true);
    expect(snackBarSpy).toHaveBeenCalledWith('mock notification', 'OK', {
      duration: 3500,
      panelClass: 'snackbar-error'
    });
  });

});
