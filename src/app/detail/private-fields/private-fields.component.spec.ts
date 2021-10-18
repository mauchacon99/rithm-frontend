import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrivateFieldsComponent } from './private-fields.component';
import { MatCardModule } from '@angular/material/card';
import { StationService } from 'src/app/core/station.service';
import { MockErrorService, MockStationService } from 'src/mocks';
import { ErrorService } from 'src/app/core/error.service';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { MockComponent } from 'ng-mocks';

describe('PrivateFieldsComponent', () => {
  let component: PrivateFieldsComponent;
  let fixture: ComponentFixture<PrivateFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PrivateFieldsComponent,
        MockComponent(LoadingIndicatorComponent)
      ],
      imports: [
        MatCardModule
      ],
      providers: [
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
