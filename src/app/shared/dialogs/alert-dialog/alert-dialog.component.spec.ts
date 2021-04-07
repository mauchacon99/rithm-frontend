import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';


import { DialogData } from 'src/models';
import { AlertDialogComponent } from './alert-dialog.component';

const DIALOG_TEST_DATA: DialogData = {
  title: 'Alert',
  message: 'This is an example alert used for testing.',
  okButtonText: 'Understood',
  cancelButtonText: 'Cancel'
};

describe('AlertDialogComponent', () => {
  let component: AlertDialogComponent;
  let fixture: ComponentFixture<AlertDialogComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertDialogComponent ],
      imports: [
        MatDialogModule,
        MatButtonModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: DIALOG_TEST_DATA }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertDialogComponent);
    component = fixture.componentInstance;
    // loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title', () => {
    expect(component.title).toBe('Alert');
  });

  it('should have message', () => {
    expect(component.message).toBe('This is an example alert used for testing.');
  });

  it('should have okay button text', () => {
    expect(component.okButtonText).toBe('Understood');
  });

  // it('should close when button is clicked', async () => {
  //   const okButton = await loader.getHarness<MatButtonHarness>(MatButtonHarness);
  //   await okButton.click();
  //   expect(component).toBeFalsy();
  // });
});
