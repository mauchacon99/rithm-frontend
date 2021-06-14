import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';

import { TopNavComponent } from './top-nav.component';

describe('TopNavComponent', () => {
  let component: TopNavComponent;
  let fixture: ComponentFixture<TopNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopNavComponent ],
      imports: [
        MatMenuModule,
        HttpClientTestingModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should display logo', () => {
    expect(component).toBeTruthy();
  });

  xit('should display notifications', () => {
    expect(component).toBeTruthy();
  });

  xit('should display a tab for every nav item', () => {
    expect(component).toBeTruthy();
  });

  xit('should display user profile', () => {
    expect(component).toBeTruthy();
  });
});
