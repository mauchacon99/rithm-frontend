import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingDrawerComponent } from './setting-drawer.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

describe('SettingDrawerComponent', () => {
  let component: SettingDrawerComponent;
  let fixture: ComponentFixture<SettingDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingDrawerComponent],
      imports: [MatSlideToggleModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
