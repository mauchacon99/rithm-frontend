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
    const emitCall = spyOn(component.itemSelected, 'emit');
    component.selectTypeElement();
    expect(emitCall).toHaveBeenCalled();
  });
});
