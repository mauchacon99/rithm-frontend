/* eslint-disable rxjs/no-ignored-error */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { Comment } from 'src/models/comment';

import { CommentService } from './comment.service';

const MICROSERVICE_PATH = '/commentservice/api/comment';

const testComment: Comment = {
  displayText: 'string',
  dateCreated: '2021-07-14T18:57:59.771Z',
  dateLastEdited: '2021-07-14T18:57:59.771Z',
  archived: true,
  user: {
    rithmId: '123',
    firstName: 'Testy',
    lastName: 'Test',
    email: 'test@test.com',
    objectPermissions: [],
    groups: [],
    createdDate: '1/2/34'
  },
  station: {
    name: 'string',
    instructions: 'sdfa',
    documents: 1,
    supervisors: [],
    rosterUsers: []
  },
  document: {
    // eslint-disable-next-line max-len
    rithmId: '1', documentName: 'Almond Flour', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 2, userAssigned: '', isEscalated: true, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', userRithmId: '', documentRithmId: '', stationRithmId: '', id: 1
  },
  rithmId: 'string'
};

describe('CommentService', () => {
  let service: CommentService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
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

    service.getDocumentComments( documentId,stationId, pageNum, commentsPerPage)
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
      dateCreated: '2021-07-14T18:57:59.771Z',
      userRithmId: '1234',
      documentRithmId: '1234',
      stationRithmId: '1234'
    };
    const expectedResponse: Comment = testComment;

    service.postDocumentComment(comment)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    // outgoing request
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/Document`
    );
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ comment });

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

});
