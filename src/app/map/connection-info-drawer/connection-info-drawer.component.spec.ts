import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionInfoDrawerComponent } from './connection-info-drawer.component';

describe('ConnectionInfoDrawerComponent', () => {
  let component: ConnectionInfoDrawerComponent;
  let fixture: ComponentFixture<ConnectionInfoDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectionInfoDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionInfoDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
