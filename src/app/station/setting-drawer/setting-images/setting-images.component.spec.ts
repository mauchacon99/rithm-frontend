import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingImagesComponent } from './setting-images.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

describe('SettingImagesComponent', () => {
  let component: SettingImagesComponent;
  let fixture: ComponentFixture<SettingImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingImagesComponent],
      imports: [MatSlideToggleModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
