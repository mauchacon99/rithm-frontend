import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { Comment } from 'src/models/comment';

import { CommentService } from './comment.service';

const MICROSERVICE_PATH = '/commentservice/api/comment';

const testComment: Comment = {
  displayText: 'string',
  stationRithmId: 'jkdfkdf',
  dateCreated: '2021-07-14T18:57:59.771Z',
  dateLastEdited: '2021-07-14T18:57:59.771Z',
  archived: true,
  userFirstName: 'Alex',
  userLastName: 'Can',
  rithmId: 'string',
};

describe('CommentService', () => {
  let service: CommentService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CommentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get a comment', () => {
    const documentId = '1234';
    const stationId = '1234';
    const pageNum = 0;
    const commentsPerPage = 3;

    const expectedResponse: Comment[] = [testComment];

    service
      .getDocumentComments(documentId, stationId, pageNum, commentsPerPage)
      .subscribe((response) => {
        expect(response.length).toBeGreaterThanOrEqual(0);
      });

    const req = httpTestingController.expectOne(
      // eslint-disable-next-line max-len
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/Document?documentId=${documentId}&stationId=${stationId}&pageNum=${pageNum}&commentsPerPage=${commentsPerPage}`
    );
    expect(req.request.method).toEqual('GET');
    expect(req.request.body).toBeFalsy();

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should respond with a posted comment', () => {
    const comment = {
      displayText: 'test',
      documentRithmId: '1234',
      stationRithmId: '1234',
    };
    const expectedResponse: Comment = testComment;

    service.postDocumentComment(comment).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    // outgoing request
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/Document`
    );
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ ...comment });

    req.flush(expectedResponse);
    httpTestingController.verify();
  });
});
