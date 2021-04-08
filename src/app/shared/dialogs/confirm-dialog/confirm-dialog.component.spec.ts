import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatDialogContent, MatDialogModule, MatDialogTitle, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { DialogData } from 'src/models';

import { ConfirmDialogComponent } from './confirm-dialog.component';

const DIALOG_TEST_DATA: DialogData = {
  title: 'Confirm',
  message: 'This is an example confirm used for testing.',
  okButtonText: 'Yep',
  cancelButtonText: 'Nope'
};

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDialogComponent ],
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
    fixture = TestBed.createComponent(ConfirmDialogComponent);
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
    const buttonElement = await loader.getHarness<MatButtonHarness>(MatButtonHarness.with({selector: '#confirm'}));
    expect(await buttonElement.getText()).toEqual(okButtonText);
    expect(okButtonText).toEqual(DIALOG_TEST_DATA.okButtonText);
  });

  it('should have cancel button text', async () => {
    const cancelButtonText = component.cancelButtonText;
    const buttonElement = await loader.getHarness<MatButtonHarness>(MatButtonHarness.with({selector: '#cancel'}));
    expect(await buttonElement.getText()).toEqual(cancelButtonText);
    expect(cancelButtonText).toEqual(DIALOG_TEST_DATA.cancelButtonText);
  });
});
