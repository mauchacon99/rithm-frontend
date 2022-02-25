import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { AddWidgetModalComponent } from './add-widget-modal.component';

describe('AddWidgetModalComponent', () => {
  let component: AddWidgetModalComponent;
  let fixture: ComponentFixture<AddWidgetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [AddWidgetModalComponent],
      providers: [{ provide: MatDialogRef, useValue: { close } }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWidgetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
