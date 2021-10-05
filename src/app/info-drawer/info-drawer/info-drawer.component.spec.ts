import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoDrawerComponent } from './info-drawer.component';

describe('InfoDrawerComponent', () => {
  let component: InfoDrawerComponent;
  let fixture: ComponentFixture<InfoDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
