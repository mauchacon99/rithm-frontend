import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { ListAdminOptionMenuType } from 'src/models';
import { AdminMenuComponent } from './admin-menu.component';

describe('AdminMenuComponent', () => {
  let component: AdminMenuComponent;
  let fixture: ComponentFixture<AdminMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminMenuComponent],
      imports: [MatListModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit itemMenuSelected', () => {
    const itemToEmit = ListAdminOptionMenuType.GroupHierarchy;
    const spyEmit = spyOn(component.itemMenuSelected, 'emit').and.callThrough();
    component.getItemSelected(itemToEmit);
    expect(spyEmit).toHaveBeenCalledOnceWith(itemToEmit);
  });
});
