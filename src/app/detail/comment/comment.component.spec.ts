import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { UserAvatarComponent } from 'src/app/shared/user-avatar/user-avatar.component';

import { CommentComponent } from './comment.component';

describe('CommentComponent', () => {
  let component: CommentComponent;
  let fixture: ComponentFixture<CommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CommentComponent,
        MockComponent(UserAvatarComponent)
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentComponent);
    component = fixture.componentInstance;
    component.commentData = {
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
        rithmId: '1', isEscalated: false, documentName: 'Almond Flour', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 2, userRithmId: '1234', updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', userAssigned: '', documentRithmId: '', stationRithmId: '', id: 1
      },
      rithmId: 'string'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
