import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { ConnectedStationPaneComponent } from 'src/app/detail/connected-station-pane/connected-station-pane.component';
import { DocumentInfoHeaderComponent } from 'src/app/detail/document-info-header/document-info-header.component';
import { DocumentTemplateComponent } from 'src/app/detail/document-template/document-template.component';
import { StationInfoHeaderComponent } from 'src/app/detail/station-info-header/station-info-header.component';
import { SubHeaderComponent } from 'src/app/detail/sub-header/sub-header.component';
import { HttpClientModule } from '@angular/common/http';

import { DocumentComponent } from './document.component';
import { DocumentService } from 'src/app/core/document.service';
import { MockDocumentService, MockErrorService } from 'src/mocks';
import { ErrorService } from 'src/app/core/error.service';

describe('DocumentComponent', () => {
  let component: DocumentComponent;
  let fixture: ComponentFixture<DocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DocumentComponent,
        MockComponent(SubHeaderComponent),
        MockComponent(ConnectedStationPaneComponent),
        MockComponent(StationInfoHeaderComponent),
        MockComponent(DocumentInfoHeaderComponent),
        MockComponent(DocumentTemplateComponent)
      ],
      imports: [
        HttpClientModule
      ],
      providers: [
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: ErrorService, useClass: MockErrorService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  beforeEach(async () => {
    component.ngOnInit();

    await fixture.whenStable();
  });

  it('should retrieve document data', () => {
    expect(component.documentInformation).toBeDefined();
  });
});
