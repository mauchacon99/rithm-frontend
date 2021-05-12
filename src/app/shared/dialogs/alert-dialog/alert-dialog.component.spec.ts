import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogContent, MatDialogModule, MatDialogTitle, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader, TestElement } from '@angular/cdk/testing';
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

// component
describe('AlertDialogComponent', () => {
  let component: AlertDialogComponent;
  let fixture: ComponentFixture<AlertDialogComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertDialogComponent],
      imports: [
        MatDialogModule,
        MatButtonModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: DIALOG_TEST_DATA },
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

  // title
  describe('title', () => {
    let titleElement: HTMLHeadingElement;

    beforeEach(() => {
      titleElement = fixture.debugElement.query(By.directive(MatDialogTitle)).nativeElement as HTMLHeadingElement;
    });

    it('should exist', () => {
      expect(titleElement).toBeTruthy();
    });

    it('should have custom text', () => {
      const titleText = component.title;
      expect(titleElement.innerText).toEqual(titleText);
      expect(titleText).toEqual(DIALOG_TEST_DATA.title);
    });

    it('should have error color when error', () => {
      component.title = 'Error';
      fixture.detectChanges();
      expect(window.getComputedStyle(titleElement).color).toEqual('rgb(145, 55, 44)'); // TODO: pull this from SCSS variable instead?
    });
  });

  // message
  describe('message', () => {
    let messageElement: HTMLParagraphElement;

    beforeEach(() => {
      const contentDiv = fixture.debugElement.query(By.directive(MatDialogContent));
      messageElement = contentDiv.children[0].nativeElement as HTMLParagraphElement;
    });

    it('should exist', () => {
      expect(messageElement).toBeTruthy();
    });

    it('should have custom text', () => {
      const messageText = component.message;
      expect(messageElement.innerText).toEqual(messageText);
      expect(messageText).toEqual(DIALOG_TEST_DATA.message);
    });
  });

  // okay button
  describe('okay button', () => {
    let buttonHarness: MatButtonHarness;

    beforeEach(async () => {
      buttonHarness = await loader.getHarness(MatButtonHarness);
    });

    it('should exist', async () => {
      expect(buttonHarness).toBeTruthy();
    });

    it('should have custom text', async () => {
      const okButtonText = component.okButtonText;
      expect(await buttonHarness.getText()).toEqual(okButtonText);
      expect(okButtonText).toEqual(DIALOG_TEST_DATA.okButtonText as string);
    });

    it('should have error color when error', async () => {
      component.title = 'Error';
      fixture.detectChanges();
      const buttonElement: TestElement = await buttonHarness.host();
      expect(await (buttonElement.hasClass('mat-error'))).toBeTruthy();
    });

    xit('should close modal when clicked', async () => {
      // TODO: Test for closing of modal on button click
      const okButton = await loader.getHarness<MatButtonHarness>(MatButtonHarness);
      await okButton.click();
      fixture.detectChanges();
      // tick();
      // expect(DIALOG_MOCK.close()).toHaveBeenCalled();
    });
  });

});
