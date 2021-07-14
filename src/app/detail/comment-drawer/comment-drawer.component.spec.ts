import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentService } from 'src/app/core/comment.service';
import { PopupService } from 'src/app/core/popup.service';
import { MockPopupService } from 'src/mocks';
import { MockCommentService } from 'src/mocks/mock-comment-service';
import { CommentDrawerComponent } from './comment-drawer.component';

describe('CommentDrawerComponent', () => {
  let component: CommentDrawerComponent;
  let fixture: ComponentFixture<CommentDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentDrawerComponent],
      providers: [
        { provide: CommentService, useClass: MockCommentService },
        { provide: PopupService, useClass: MockPopupService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
