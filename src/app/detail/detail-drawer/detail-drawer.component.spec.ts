import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { CommentDrawerComponent } from '../comment-drawer/comment-drawer.component';
import { HistoryDrawerComponent } from '../history-drawer/history-drawer.component';

import { DetailDrawerComponent } from './detail-drawer.component';

describe('DetailDrawerComponent', () => {
  let component: DetailDrawerComponent;
  let fixture: ComponentFixture<DetailDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DetailDrawerComponent,
        MockComponent(CommentDrawerComponent),
        MockComponent(HistoryDrawerComponent),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
