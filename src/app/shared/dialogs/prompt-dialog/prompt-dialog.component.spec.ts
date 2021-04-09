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

describe('PromptDialogComponent', () => {
  let component: PromptDialogComponent;
  let fixture: ComponentFixture<PromptDialogComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromptDialogComponent ],
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

  // TODO: Add unit test to check for the placeholder/label

  // it('should have placeholder text for prompt input', async () => {
  //   const promptLabel = component.promptLabel;
  //   const inputElement = await loader.getHarness<MatInputHarness>(MatInputHarness);
  //   expect(await inputElement.getName()).toEqual(promptLabel as string);
  //   expect(promptLabel).toEqual(DIALOG_TEST_DATA.promptInput as string);
  // });

  it('should have prompt input field text', async () => {
    const promptInput = component.promptInput;
    const inputElement = await loader.getHarness<MatInputHarness>(MatInputHarness);
    expect(await inputElement.getValue()).toEqual(promptInput);
    expect(promptInput).toEqual(DIALOG_TEST_DATA.promptInput as string);
  });

  it('should have okay button text', async () => {
    const okButtonText = component.okButtonText;
    const buttonElement = await loader.getHarness<MatButtonHarness>(MatButtonHarness.with({selector: '#confirm'}));
    expect(await buttonElement.getText()).toEqual(okButtonText);
    expect(okButtonText).toEqual(DIALOG_TEST_DATA.okButtonText as string);
  });

  it('should have cancel button text', async () => {
    const cancelButtonText = component.cancelButtonText;
    const buttonElement = await loader.getHarness<MatButtonHarness>(MatButtonHarness.with({selector: '#cancel'}));
    expect(await buttonElement.getText()).toEqual(cancelButtonText);
    expect(cancelButtonText).toEqual(DIALOG_TEST_DATA.cancelButtonText as string);
  });
});
