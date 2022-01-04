import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowLogicComponent } from './flow-logic.component';
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ConnectedStationInfo } from "src/models";
import { RuleModalComponent } from "../rule-modal/rule-modal.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
        MatDialogModule,
        BrowserAnimationsModule
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
    it('should to call MatDialog service', async () => {
      const expectDataModal = {
        panelClass: ['w-5/6', 'sm:w-4/5'],
        maxWidth: '1024px',
        data: { station: nextStations[0] }
      };
      const dialogSpy = spyOn(TestBed.inject(MatDialog), 'open').and.callThrough();
      await component.openModal(nextStations[0]);
      expect(dialogSpy).toHaveBeenCalledOnceWith(RuleModalComponent, expectDataModal);
    });

    it('should to call method openModal after clicked in button', () => {
      const spyFunc = spyOn(component, 'openModal').and.callThrough();
      const btnOpenModal = fixture.nativeElement.querySelector('#new-rule');
      expect(btnOpenModal).toBeTruthy();
      btnOpenModal.click();
      expect(spyFunc).toHaveBeenCalledOnceWith(nextStations[0]);
    });
  });
});
