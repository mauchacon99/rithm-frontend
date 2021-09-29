import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PopupService } from 'src/app/core/popup.service';

import { MapOverlayComponent } from './map-overlay.component';

describe('MapOverlayComponent', () => {
  let component: MapOverlayComponent;
  let fixture: ComponentFixture<MapOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapOverlayComponent],
      imports: [MatDialogModule, MatSnackBarModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display confirmation prompt when cancel', () => {
    const dialogSpy = spyOn(TestBed.inject(PopupService), 'confirm');
    component.cancel();
    expect(dialogSpy).toHaveBeenCalledTimes(1);
  });
});
