import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { UserListModalComponent } from './user-list-modal.component';

describe('UserListModalComponent', () => {
  let component: UserListModalComponent;
  let fixture: ComponentFixture<UserListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserListModalComponent],
      providers: [{ provide: MatDialogRef, useValue: { close } }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the modal when close-modal-btn clicked', () => {
    const spyMatDialogRef = spyOn(TestBed.inject(MatDialogRef), 'close');
    const spyMethod = spyOn(component, 'closeModal').and.callThrough();
    const btnClose = fixture.nativeElement.querySelector('#close-modal-btn');
    expect(btnClose).toBeTruthy();
    btnClose.click();
    expect(spyMethod).toHaveBeenCalled();
    expect(spyMatDialogRef).toHaveBeenCalled();
  });
});
