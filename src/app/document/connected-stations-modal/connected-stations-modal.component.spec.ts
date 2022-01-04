import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ConnectedStationsModalComponent } from './connected-stations-modal.component';

const DATA_TEST = {
  documentRithmId: 'E204F369-386F-4E41',
  stationRithmId: 'E204F369-386F-4E41',
};

describe('ConnectedStationsModalComponent', () => {
  let component: ConnectedStationsModalComponent;
  let fixture: ComponentFixture<ConnectedStationsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectedStationsModalComponent],
      imports: [
        NoopAnimationsModule,
        MatDialogModule,
        MatButtonModule,
        MatSelectModule,
      ],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: DATA_TEST }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectedStationsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
