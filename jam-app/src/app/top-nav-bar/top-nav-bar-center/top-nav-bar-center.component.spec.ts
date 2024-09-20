import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopNavBarCenterComponent } from './top-nav-bar-center.component';

describe('TopNavBarCenterComponent', () => {
  let component: TopNavBarCenterComponent;
  let fixture: ComponentFixture<TopNavBarCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopNavBarCenterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopNavBarCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
