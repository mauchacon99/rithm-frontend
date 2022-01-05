import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { UserAvatarComponent } from 'src/app/shared/user-avatar/user-avatar.component';

import { CommentComponent } from './comment.component';

describe('CommentComponent', () => {
  let component: CommentComponent;
  let fixture: ComponentFixture<CommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentComponent, MockComponent(UserAvatarComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentComponent);
    component = fixture.componentInstance;
    component.comment = {
      displayText: 'string',
      stationRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      dateCreated: '2021-07-14T18:57:59.771Z',
      dateLastEdited: '2021-07-14T18:57:59.771Z',
      archived: true,
      userFirstName: 'Alex',
      userLastName: 'Can',
      rithmId: 'string',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
