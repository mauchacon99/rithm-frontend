import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommentService } from 'src/app/core/comment.service';
import { ErrorService } from 'src/app/core/error.service';
import { MockCommentService, MockErrorService } from 'src/mocks';

import { CommentInputComponent } from './comment-input.component';

describe('CommentInputComponent', () => {
  let component: CommentInputComponent;
  let fixture: ComponentFixture<CommentInputComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentInputComponent],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
      ],
      providers: [
        { provide: CommentService, useClass: MockCommentService },
        { provide: ErrorService, useClass: MockErrorService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentInputComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should require a comment before posting', async () => {
    const buttonHarness = await loader.getHarness(
      MatButtonHarness.with({ selector: '#commentPostButton' })
    );
    const comment = component.commentForm.controls['comment'];
    expect(comment.valid).toBeFalse();
    expect(comment.hasError('required')).toBeTrue();
    expect(component.commentForm.valid).toBeFalse();
    expect(await buttonHarness.isDisabled()).toBeTrue();
  });

  it('should enable comment form once comment is posted', async () => {
    component.addComment();
    expect(component.commentForm.disabled).toBe(true);
  });
});
