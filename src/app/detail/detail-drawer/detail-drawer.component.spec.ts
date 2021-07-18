import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
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
        MockComponent(HistoryDrawerComponent)
      ],
      imports: [
        MatDialogModule,
        MatSnackBarModule
      ]
    })
    .compileComponents();
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
