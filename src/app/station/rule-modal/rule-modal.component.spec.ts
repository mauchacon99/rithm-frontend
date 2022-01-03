import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {RuleModalComponent} from './rule-modal.component';
import {ConnectedStationInfo} from ".src/models";

describe('RuleModalComponent', () => {
  let component: RuleModalComponent;
  let fixture: ComponentFixture<RuleModalComponent>;
  const DIALOG_TEST_DATA: ConnectedStationInfo = {
      rithmId: '34904ac2-6bdd-4157-a818-50ffb37fdfbc',
      name: 'Untitled Station'
    };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule
      ],
      declarations: [ RuleModalComponent ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: DIALOG_TEST_DATA }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
