import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogContent, MatDialogModule, MatDialogTitle, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';


import { DialogData } from 'src/models';
import { AlertDialogComponent } from './alert-dialog.component';
import { By } from '@angular/platform-browser';

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
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title', () => {
    const titleText = component.title;
    const titleElement = fixture.debugElement.query(By.directive(MatDialogTitle)).nativeElement as HTMLHeadingElement;
    expect(titleElement.innerText).toEqual(titleText);
    expect(titleText).toEqual(DIALOG_TEST_DATA.title);
  });

  it('should have message', () => {
    const messageText = component.message;
    const contentDiv = fixture.debugElement.query(By.directive(MatDialogContent));
    const messageElement = contentDiv.children[0].nativeElement as HTMLParagraphElement;
    expect(messageElement.innerText).toEqual(messageText);
    expect(messageText).toEqual(DIALOG_TEST_DATA.message);

  });

  it('should have okay button text', async () => {
    const okButtonText = component.okButtonText;
    const buttonElement = await loader.getHarness<MatButtonHarness>(MatButtonHarness);
    expect(await buttonElement.getText()).toEqual(okButtonText);
    expect(okButtonText).toEqual(DIALOG_TEST_DATA.okButtonText as string);
  });

  // it('should close when button is clicked', async () => {
  //   const okButton = await loader.getHarness<MatButtonHarness>(MatButtonHarness);
  //   await okButton.click();
  //   expect(component).toBeFalsy();
  // });
});
