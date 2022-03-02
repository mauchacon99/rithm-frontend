import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemListWidgetModalComponent } from './item-list-widget-modal.component';

describe('ItemListWidgetModalComponent', () => {
  let component: ItemListWidgetModalComponent;
  let fixture: ComponentFixture<ItemListWidgetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemListWidgetModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemListWidgetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
