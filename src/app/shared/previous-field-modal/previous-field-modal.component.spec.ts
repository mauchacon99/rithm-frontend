import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, } from '@angular/material/dialog';
import { PreviousFieldModalComponent } from './previous-field-modal.component';


const DIALOG_TEST_DATA: {
  /** The rithmId for the previous field. */
  rithmId: string;
  /** Whether the previous field is private. */
  isPrivate: boolean;
} = {
  rithmId: '73d47261-1932-4fcf-82bd-159eb1a7243f',
  isPrivate: true
};


describe('PreviousFieldModalComponent', () => {
  let component: PreviousFieldModalComponent;
  let fixture: ComponentFixture<PreviousFieldModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PreviousFieldModalComponent,
      ],
      imports: [
        MatDialogModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: DIALOG_TEST_DATA },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousFieldModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
