import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng-mocks';
import { CommentService } from 'src/app/core/comment.service';
import { ErrorService } from 'src/app/core/error.service';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { MockErrorService } from 'src/mocks';
import { MockCommentService } from 'src/mocks/mock-comment-service';
import { CommentInputComponent } from '../comment-input/comment-input.component';
import { CommentComponent } from '../comment/comment.component';

import { CommentDrawerComponent } from './comment-drawer.component';

describe('CommentDrawerComponent', () => {
  let component: CommentDrawerComponent;
  let fixture: ComponentFixture<CommentDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CommentDrawerComponent,
        MockComponent(CommentComponent),
        MockComponent(LoadingIndicatorComponent),
        MockComponent(CommentInputComponent),
      ],
      imports: [NoopAnimationsModule, MatTabsModule],
      providers: [
        { provide: CommentService, useClass: MockCommentService },
        { provide: ErrorService, useClass: MockErrorService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load more comments', fakeAsync(() => {
    component.documentId = '1234';
    component.stationId = '1234';
    component.commentPage = 0;
    component.comments = [
      {
        displayText: 'This is first comment',
        stationRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
        dateCreated: '2021-06-16T17:26:47.3506612Z',
        dateLastEdited: '2021-07-14T17:26:47.3506612Z',
        archived: false,
        rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
        userRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      },
      {
        displayText: 'This is second comment',
        stationRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
        dateCreated: '2021-06-15T17:26:47.3506612Z',
        dateLastEdited: '2021-07-12T17:26:47.3506612Z',
        archived: false,
        rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
        userRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      },
    ];

    component.loadMore();
    tick(1000);
    expect(component.comments.length).toBe(4);
  }));

  it('should add a newly posted comment to the list of comments', () => {
    const comment = {
      displayText: 'This is first comment',
      stationRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      dateCreated: '2021-06-16T17:26:47.3506612Z',
      dateLastEdited: '2021-07-14T17:26:47.3506612Z',
      archived: false,
      rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      userRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
    };
    component.addNewComment(comment);
    expect(component.comments.unshift(comment));
  });

  it('should set the loading status when a comment is loading `true`', () => {
    const loadingStatus = true;
    component.setPostingLoading(loadingStatus);
    expect(component.loadingPostedComment).toBe(loadingStatus);
  });

  it('should set the loading status when a comment is loading `false`', () => {
    const loadingStatus = false;
    component.setPostingLoading(loadingStatus);
    expect(component.loadingPostedComment).toBe(loadingStatus);
  });
});
