import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowLogicComponent } from './flow-logic.component';
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import {ConnectedStationInfo} from "../../../models";
import {of} from "rxjs";

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
      declarations: [ FlowLogicComponent ]
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

  describe('Should tested mat modal in component', () => {
    const dialogRefSpyObj = jasmine.createSpyObj({
      // eslint-disable-next-line rxjs/finnish
      afterClosed: of({}),
      close: null
    });

    dialogRefSpyObj.componentInstance = {
      body: ''
    };

    it('should be open modal', () => {
      const dialogSpy = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
      component.openModal(component.nextStations[0]);
      expect(dialogSpy).toHaveBeenCalled();
      expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled();
    });
  });
});
