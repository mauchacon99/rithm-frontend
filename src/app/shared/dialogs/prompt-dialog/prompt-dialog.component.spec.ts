import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';

import { MatDialogContent, MatDialogModule, MatDialogTitle, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { DialogData } from 'src/models';

import { PromptDialogComponent } from './prompt-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

const DIALOG_TEST_DATA: DialogData = {
  title: 'Prompt',
  message: 'This is an example prompt used for testing.',
  promptLabel: 'Grandma name',
  promptInput: 'Gertrude',
  okButtonText: 'Go',
  cancelButtonText: 'Nope'
};

// component
describe('PromptDialogComponent', () => {
  let component: PromptDialogComponent;
  let fixture: ComponentFixture<PromptDialogComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PromptDialogComponent],
      imports: [
        FormsModule,
        MatDialogModule,
        MatButtonModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: DIALOG_TEST_DATA }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptDialogComponent);
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

  // input
  describe('input', () => {
    let inputElement: MatInputHarness;

    beforeEach(async () => {
      inputElement = await loader.getHarness(MatInputHarness);
    });

    xit('should have placeholder text', async () => {
      // TODO: Add unit test to check for the placeholder/label
      const promptLabel = component.promptLabel;
      expect(await inputElement.getName()).toEqual(promptLabel as string);
      expect(promptLabel).toEqual(DIALOG_TEST_DATA.promptInput as string);
    });

    it('should have text pre-populated', async () => {
      const promptInput = component.promptInput;
      expect(await inputElement.getValue()).toEqual(promptInput);
      expect(promptInput).toEqual(DIALOG_TEST_DATA.promptInput as string);
    });
  });

  // okay button
  describe('okay button', () => {
    let buttonHarness: MatButtonHarness;

    beforeEach(async () => {
      buttonHarness = await loader.getHarness<MatButtonHarness>(MatButtonHarness.with({ selector: '#confirm' }));
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
      buttonHarness = await loader.getHarness<MatButtonHarness>(MatButtonHarness.with({ selector: '#cancel' }));
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
