import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemListWidgetModal } from 'src/models';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { CustomTabWidgetModalComponent } from './custom-tab-widget-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { MockDashboardService } from 'src/mocks';

describe('CustomTabWidgetModalComponent', () => {
  let component: CustomTabWidgetModalComponent;
  let fixture: ComponentFixture<CustomTabWidgetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomTabWidgetModalComponent],
      imports: [HttpClientModule],
      providers: [DashboardService, MockDashboardService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTabWidgetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get list tab documents', () => {
    const rithmId = 'E204F369-386F-4E41-B3CA-2459E674DF52';
    const itemListWidgetModal: ItemListWidgetModal[] = [
      {
        documentRithmId: rithmId,
        isChainedGroup: true,
        totalDocuments: 5,
        totalStations: 5,
        totalSubGroups: 5,
      },
      {
        documentRithmId: rithmId,
        isChainedGroup: true,
        totalDocuments: 5,
        totalStations: 5,
        totalSubGroups: 5,
      },
    ];
    component['getListTabDocuments'](rithmId).subscribe((response) => {
      expect(response).toEqual(itemListWidgetModal);
    });
  });
});
