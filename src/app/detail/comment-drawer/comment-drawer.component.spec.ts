import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng-mocks';
import { ErrorService } from 'src/app/core/error.service';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { MockErrorService } from 'src/mocks';
import { MockCommentService } from 'src/mocks/mock-comment-service';
import { CommentInputComponent } from '../comment-input/comment-input.component';
import { CommentService } from '../comment.service';
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
        MockComponent(CommentInputComponent)
      ],
      imports: [
        MatTabsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: CommentService, useClass: MockCommentService },
        { provide: ErrorService, useClass: MockErrorService }
      ],
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

  it('posted comment should update postedComment', fakeAsync(() => {
    const comment = {
      displayText: 'test',
      dateCreated: '2021-07-14T18:57:59.771Z',
      userRithmId: '1234',
      documentRithmId: '1234',
      stationRithmId: '1234'
    };
    component.postComment(comment);
    tick(1000);
    expect(component.postedComment).toBeDefined();

  }));

  it('should have more than 0 comments', fakeAsync(() => {
    component.getDocumentComments('1234','1234',0,20,false);
    tick(1000);
    expect(component.comments.length).toBeGreaterThan(0);
  }));

  it('should load more comments', fakeAsync(() => {
    component.documentId = '1234';
    component.stationId = '1234';
    component.commentPage = 0;
    component.comments = [{
      displayText: 'This is first comment',
      dateCreated: '2021-06-16T17:26:47.3506612Z',
      dateLastEdited: '2021-07-14T17:26:47.3506612Z',
      archived: false,
      rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      userRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C'
    }, {
      displayText: 'This is second comment',
      dateCreated: '2021-06-15T17:26:47.3506612Z',
      dateLastEdited: '2021-07-12T17:26:47.3506612Z',
      archived: false,
      rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      userRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C'
    }];

    component.loadMore();
    tick(1000);
    expect(component.comments.length).toBe(4);
  }));
});
