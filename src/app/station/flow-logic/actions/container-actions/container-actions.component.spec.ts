import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerActionsComponent } from './container-actions.component';

describe('ContainerComponent', () => {
  let component: ContainerActionsComponent;
  let fixture: ComponentFixture<ContainerActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContainerActionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
