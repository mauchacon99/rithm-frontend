import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { AddWidgetModalComponent } from './add-widget-modal.component';
import { MockComponent } from 'ng-mocks';
import { CustomTabWidgetModalComponent } from 'src/app/dashboard/widget-modal/custom-tab-widget-modal/custom-tab-widget-modal.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SelectedItemWidgetModel } from '../../../../models';

describe('AddWidgetModalComponent', () => {
  let component: AddWidgetModalComponent;
  let fixture: ComponentFixture<AddWidgetModalComponent>;
  const DIALOG_TEST_DATA: {
    /** The dashboard rithmId. */ dashboardRithmId: string;
  } = {
    dashboardRithmId: '73d47261-1932-4fcf-82bd-159eb1a7243f',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: MatDialogRef, useValue: { close } },
        { provide: MAT_DIALOG_DATA, useValue: DIALOG_TEST_DATA },
      ],
      imports: [MatTabsModule, NoopAnimationsModule, MatDialogModule],
      declarations: [
        AddWidgetModalComponent,
        MockComponent(CustomTabWidgetModalComponent),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWidgetModalComponent);
    component = fixture.componentInstance;
    component.tabParentSelect = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call close the modal in dialogRef service', () => {
    const spyMatDialogRef = spyOn(TestBed.inject(MatDialogRef), 'close');
    const spyMethod = spyOn(component, 'closeModal').and.callThrough();
    const btnClose = fixture.nativeElement.querySelector(
      '#close-widget-builder'
    );
    expect(btnClose).toBeTruthy();
    btnClose.click();
    expect(spyMethod).toHaveBeenCalled();
    expect(spyMatDialogRef).toHaveBeenCalled();
  });

  it('should test emit value', () => {
    const expectedValue: SelectedItemWidgetModel = {
      itemType: 'station',
      itemList: {
        rithmId: 'string',
        name: 'string',
        totalDocuments: 0,
        groupName: 'string',
        isChained: false,
        totalStations: 0,
        totalSubGroups: 0,
        stationName: 'string',
        stationGroupName: 'string',
      },
    };
    const showElement = expectedValue.itemType;
    const emitCall = spyOn(component.itemSelected, 'emit');
    component.selectTypeElement(expectedValue);
    expect(showElement).toBe('station');
    expect(emitCall).toHaveBeenCalled();
  });
});
