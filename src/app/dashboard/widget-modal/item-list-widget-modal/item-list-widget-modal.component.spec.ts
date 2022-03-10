import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';

import { ItemListWidgetModalComponent } from './item-list-widget-modal.component';

describe('ItemListWidgetModalComponent', () => {
  let component: ItemListWidgetModalComponent;
  let fixture: ComponentFixture<ItemListWidgetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemListWidgetModalComponent],
      imports: [MatTabsModule, MatTableModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemListWidgetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test emit value', () => {
    const element = {
      rithmId: 'string',
      name: 'string',
      totalDocuments: 0,
      groupName: 'string',
      isChained: false,
      totalStations: 0,
      totalSubGroups: 0,
      stationName: 'string',
      stationGroupName: 'string',
    };
    const emitCall = spyOn(component.itemSelected, 'emit');
    component.selectTypeElement(element);
    expect(emitCall).toHaveBeenCalled();
  });
});
