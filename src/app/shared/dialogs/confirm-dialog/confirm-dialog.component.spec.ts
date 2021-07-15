import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { DialogData } from 'src/models';

import { ConfirmDialogComponent } from './confirm-dialog.component';

const DIALOG_TEST_DATA: DialogData = {
  title: 'Confirm',
  message: 'This is an example confirm used for testing.',
  okButtonText: 'Yep',
  cancelButtonText: 'Nope'
};

// component
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

  // title
  describe('title', () => {
    let titleElement: HTMLElement;

    beforeEach(() => {
      titleElement = fixture.debugElement.query(By.css('#title')).nativeElement as HTMLHeadingElement;
    });

    it('should exist', () => {
      expect(titleElement).toBeTruthy();
    });

    it('should have custom text', () => {
      const titleText = component.title;
      expect(titleElement.textContent).toEqual(titleText);
      expect(titleText).toEqual(DIALOG_TEST_DATA.title);
    });
  });

  // message
  describe('message', () => {
    let messageElement: HTMLParagraphElement;

    beforeEach(() => {
      messageElement = fixture.debugElement.query(By.css('#message')).nativeElement as HTMLHeadingElement;
    });

    it('should exist', () => {
      expect(messageElement).toBeTruthy();
    });

    it('should have custom text', () => {
      const messageText = component.message;
      expect(messageElement.textContent).toEqual(messageText);
      expect(messageText).toEqual(DIALOG_TEST_DATA.message);
    });
  });

  // okay button
  describe('okay button', () => {
    let buttonHarness: MatButtonHarness;

    beforeEach(async () => {
      buttonHarness = await loader.getHarness<MatButtonHarness>(MatButtonHarness.with({selector: '#confirm'}));
    });

    it('should exist', async () => {
      expect(buttonHarness).toBeTruthy();
    });

    it('should have custom text', async () => {
      const okButtonText = component.okButtonText;
      expect(await buttonHarness.getText()).toEqual(okButtonText);
      expect(okButtonText).toEqual(DIALOG_TEST_DATA.okButtonText as string);
    });
  });

  // cancel button
  describe('okay button', () => {
    let buttonHarness: MatButtonHarness;

    beforeEach(async () => {
      buttonHarness = await loader.getHarness<MatButtonHarness>(MatButtonHarness.with({selector: '#cancel'}));
    });

    it('should exist', async () => {
      expect(buttonHarness).toBeTruthy();
    });

    it('should have custom text', async () => {
      const cancelButtonText = component.cancelButtonText;
      expect(await buttonHarness.getText()).toEqual(cancelButtonText);
      expect(cancelButtonText).toEqual(DIALOG_TEST_DATA.cancelButtonText as string);
    });
  });
});
