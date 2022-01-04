import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowLogicComponent } from './flow-logic.component';
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ConnectedStationInfo } from "src/models";
import { RuleModalComponent } from "../rule-modal/rule-modal.component";

describe('FlowLogicComponent', () => {
  let component: FlowLogicComponent;
  let fixture: ComponentFixture<FlowLogicComponent>;
  const nextStations: ConnectedStationInfo[] = [{
    rithmId: '34904ac2-6bdd-4157-a818-50ffb37fdfbc',
    name: 'Untitled Station'
  }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule
      ],
      declarations: [FlowLogicComponent, RuleModalComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowLogicComponent);
    component = fixture.componentInstance;
    component.nextStations = nextStations;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('New rule modal', () => {

    it('should to call function openModal', () => {
      const openModal = spyOn(component, 'openModal');
      const btnOpenModal = fixture.nativeElement.querySelector('#new-rule');
      expect(btnOpenModal).toBeTruthy();
      btnOpenModal.click();
      expect(openModal).toHaveBeenCalled();
    });

    it('should to call dialog service', () => {
      const dialogSpy = spyOn(TestBed.inject(MatDialog), 'open');
      const btnOpenModal = fixture.nativeElement.querySelector('#new-rule');
      expect(btnOpenModal).toBeTruthy();
      btnOpenModal.click();
      expect(dialogSpy).toHaveBeenCalled();
    });
  });
});
