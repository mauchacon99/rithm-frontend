import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowLogicComponent } from './flow-logic.component';
import {MatDialogModule} from "@angular/material/dialog";

describe('FlowLogicComponent', () => {
  let component: FlowLogicComponent;
  let fixture: ComponentFixture<FlowLogicComponent>;

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
