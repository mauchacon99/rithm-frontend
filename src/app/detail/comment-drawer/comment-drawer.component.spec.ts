import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng-mocks';
import { ErrorService } from 'src/app/core/error.service';
import { MockErrorService } from 'src/mocks';
import { MockCommentService } from 'src/mocks/mock-comment-service';
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
        MockComponent(CommentComponent)
      ],
      imports: [
        MatTabsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: CommentService, useClass: MockCommentService,},
        { provide: ErrorService, useClass: MockErrorService}
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
});
